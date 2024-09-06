import { loggerService } from "../../services/logger.service.js";
import { UserService } from "./user.service.js";


export async function getUsers(req, res){
    try {
        const users = UserService.query()
        res.send(users)
    } catch (err) {
        console.log('Couldent gat users', err)
        res.status(400).send("Couldnt get users")
    }
}

export async function getUser(req, res){
    const {userId } = req.params
    try {
        const user = await UserService.getById(userId)
        res.send(user)
    } catch (err) {
        console.log(`couldnt find user with id ${userId}`, err)
        res.status(401).send("user not find")
    }
}