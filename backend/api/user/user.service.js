import { ObjectId } from "mongodb";
import { loggerService } from "../../services/logger.service.js";

import fs from "fs";
import { dbService } from "../../services/db.service.js";


export const UserService = {
    query,
    getById,
    // save,
    // remove,
    update
}

async function query(filterBy ={}){
    const {sortBy, ...rest} = filterBy

    try {
        const criteria =_buildCriteria(filterBy)
        const sort = _buildSort(filterBy)

        const collection = await dbService.getCollection('user')
        var userCursor = await collection.find(criteria, {sort})

        let usersToDisplay = await userCursor.toArray()
        return usersToDisplay
    } catch (err) {
        loggerService.error("Couldnt get users", err)
        throw err
    }
}

async function getById(userId){
    try {
        const criteria = {_id: ObjectId.createFromHexString(userId)}
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne(criteria)
        return user
    } catch (err) {
        loggerService.error(`Couldnt find user with Id ${userId}`, err)
        throw err
    }
}

async function update(user){
    const {following , followers} = user
    const userToUpdate = {following, followers}

    try {
        const criteria = { _id: ObjectId.createFromHexString(user._id) }
        const collection = await dbService.getCollection("user")

        await collection.updateOne(criteria, {$set : userToUpdate})
    } catch (err) {
        loggerService.error("Cannot update user with id", user._id)
        throw err
    }

}











function _buildCriteria(filterBy){
    const criteria ={ 
    }
    return criteria
}

function _buildSort({sortBy}){
    if (!sortBy) return {}
    return { [sortBy.by]: sortBy.dir}
}