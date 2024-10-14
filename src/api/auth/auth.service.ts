import { User, Role, UserInput, UserRoles, UserRolesInput } from './auth.interface'
import db from '../../config/db.config'
import { customError, customeSuccessfulResponse } from '../../interface/io.interface'
import hashUtils from '../../utils/hash.utils'
import tokenUtils from '../../utils/token.utils'
import { StatusCodes } from 'http-status-codes'
import { RoleInput } from '../roles/roles.interface'
class authService {
    async register(registerInput: UserInput): Promise<customeSuccessfulResponse> {
        try {
            const { email, username, password } = registerInput
            const [isExistedEmail]: [User[], any] = await db.pool.query(`SELECT * FROM users WHERE email = ?`, [email])
            if (isExistedEmail?.length > 0)
                throw new customError(StatusCodes.CONFLICT, "Email is already existed")
            const [isExistedUsername]: [User[], any] = await db.pool.query(`SELECT * FROM users WHERE username = ?`, [username])
            if (isExistedUsername?.length > 0)
                throw new customError(StatusCodes.CONFLICT, "Username is already existed")
            const hashPassword = await hashUtils.hashPassword(password)
            await db.pool.query(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`, [email, username, hashPassword])
            return new customeSuccessfulResponse(StatusCodes.CREATED, "Register successful")
        } catch (err) {
            throw err
        }
    }
    async login(loginInput: UserInput): Promise<customeSuccessfulResponse> {
        try {
            const { username, password } = loginInput
            const [isExistedUser]: [User[], any] = await db.pool.query(`SELECT * FROM users WHERE username = ?`, [username])
            if (!isExistedUser?.length)
                throw new customError(StatusCodes.NOT_FOUND, "Username or password incorrect!")
            if (!await hashUtils.comparePassword(password, isExistedUser[0].password))
                throw new customError(StatusCodes.NOT_FOUND, "Username or password incorrect!")
            const token: string = tokenUtils.generateToken(isExistedUser[0].id)

            return new customeSuccessfulResponse(StatusCodes.OK, "Login successful", { token })
        } catch (err) {
            throw err
        }
    }
    async getRoleNameByUserId(id: number): Promise<string> {
        try {
            const [userRoles]: [UserRoles[], any] = await db.pool.query(`SELECT roleId FROM userRoles WHERE userId = ?`, [id])
            if (!userRoles.length)
                throw new customError(StatusCodes.NOT_FOUND, 'User not found')
            const roleIds: number[] = userRoles.map((userRole: UserRoles) => userRole.roleId)
            const [roles]: [Role[], any] = await db.pool.query(`SELECT name FROM roles WHERE id IN (?)`, [roleIds])
            return roles.map((role: Role) => role.name).join(', ')
        } catch (err) {
            throw err
        }
    }
    async get(info: string, id: number): Promise<customeSuccessfulResponse> {
        try {
            if (info == 'me') {
                const [isExistedUser]: [User[], any] = await db.pool.query(`SELECT * FROM users WHERE id = ?`, [id])
                if (isExistedUser?.length == 0)
                    throw new customError(StatusCodes.UNAUTHORIZED, 'Invalid token')
                const { username, email, password }: UserInput = isExistedUser[0]
                return new customeSuccessfulResponse(StatusCodes.ACCEPTED, "Get info successful", {
                    username, email, password,
                    role: await this.getRoleNameByUserId(id)
                })
            }
            else if (info == 'all') {
                const [isExistedUser]: [User[], any] = await db.pool.query(`SELECT id, username, email from users`)
                if (!(isExistedUser?.length))
                    throw new customError(StatusCodes.NOT_FOUND, 'Not found')
                const response = await Promise.all(isExistedUser.map(async (user: User) => {
                    return {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: await this.getRoleNameByUserId(user.id)
                    }
                }))
                return new customeSuccessfulResponse(StatusCodes.OK, "Get all user successful", response)
            }
            else {
                const [isExistedUser]: [User[], any] = await db.pool.query(`SELECT id, username, email from users WHERE id = ?`, [info])
                if (!isExistedUser.length)
                    throw new customError(StatusCodes.NOT_FOUND, 'Id is invalid')
                const reponse = {
                    id: isExistedUser[0].id,
                    username: isExistedUser[0].username,
                    email: isExistedUser[0].email,
                    role: await this.getRoleNameByUserId(isExistedUser[0].id)
                }
                return new customeSuccessfulResponse(StatusCodes.OK, "Get user successful", reponse)
            }
        } catch (err) {
            throw err
        }
    }
    deleteUser = async (id: string): Promise<customeSuccessfulResponse> => {
        try {
            const [isExistedUser]: [User[], any] = await db.pool.query(`SELECT * FROM users WHERE id = ?`, [id])
            if (!(isExistedUser?.length))
                throw new customError(StatusCodes.NOT_FOUND, 'Id is invalid')
            const [isExistedUserRoles]: [UserRoles[], any] = await db.pool.query(`SELECT * FROM userRoles WHERE userId = ?`, [id])
            for (const userRole of isExistedUserRoles) {
                if (userRole.roleId == 1)
                    throw new customError(StatusCodes.FORBIDDEN, "Cannot delete admin")
            }
            await db.pool.query(`DELETE FROM users WHERE id = ?`, [id])
            return new customeSuccessfulResponse(StatusCodes.ACCEPTED, "Delete user successful")
        }
        catch (err) {
            throw err
        }
    }
    updateUser = async (info: UserInput, id: number): Promise<customeSuccessfulResponse> => {
        try {
            const { username, password, email } = info
            const [isExistedUser]: [User[], any] = await db.pool.query(`SELECT * FROM users WHERE id = ?`, [id])
            if (!(isExistedUser?.length))
                throw new customError(StatusCodes.NOT_FOUND, 'Id is invalid')
            const user: User = isExistedUser[0]
            if (user.username != username || user.email != email)
                throw new customError(StatusCodes.FORBIDDEN, "Cannot change email or username or role")
            if (await hashUtils.comparePassword(password, user.password))
                throw new customError(StatusCodes.BAD_REQUEST, "New password must be different from current password")
            const hashPassword = await hashUtils.hashPassword(password)
            await db.pool.query(`UPDATE users SET password = ?`, [hashPassword])
            return new customeSuccessfulResponse(StatusCodes.ACCEPTED, "Update user successful")
        }
        catch (err) {
            throw err
        }
    }
    async assignRole(assignRole: UserRolesInput): Promise<customeSuccessfulResponse> {
        try {
            const { username, roleName } = assignRole
            const [roles]: [Role[], any] = await db.pool.query(`SELECT * FROM roles WHERE name = ?`, [roleName])
            if (!roles.length)
                throw new customError(StatusCodes.NOT_FOUND, 'Role not found')
            const roleId = roles[0].id
            const [users]: [User[], any] = await db.pool.query(`SELECT * FROM users WHERE username = ?`, [username])
            if (!users.length)
                throw new customError(StatusCodes.NOT_FOUND, 'User not found')
            const userId = users[0].id
            const [isExistedUserRoles]: [UserRoles[], any] = await db.pool.query(`SELECT * FROM userRoles WHERE userId = ? AND roleId = ?`, [userId, roleId])
            if (isExistedUserRoles.length)
                throw new customError(StatusCodes.CONFLICT, 'User already has this role')
            await db.pool.query(`INSERT INTO userRoles (userId, roleId) VALUES (?, ?)`, [userId, roleId])
            return new customeSuccessfulResponse(StatusCodes.CREATED, "Assign role successful")
        } catch (err) {
            throw err
        }
    }
}
export default new authService()