import fs from 'fs'

require('dotenv').config()
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

import { User } from '../models/User'

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-rxesh.mongodb.net/${process.env.MONGO_DEFAULT_DB}`

console.log(MONGODB_URI)

mongoose.connect(MONGODB_URI, { useUnifiedTopology: true })
    .then(result => {
        console.log('Database connection successful')
    })
    .catch(err => {
        console.log(err)
    })


const people = fs.readFileSync('./data/people.json')

function loadPeople() {
    const list = JSON.parse(people)

    return list.map(prs => {
        return {
            data: {
                firstName: prs.firstName,
                lastName: prs.lastName,
                gender: prs.gender,
                region: prs.region,
                age: prs.age,
                phone: prs.phone,
                birthday: prs.birthday.mdy,
                password: prs.password,
                email: prs.email,
                photoLg: prs.photoLg,
                photoSm: prs.photoSm,
                backgroundImageUrl: '',
                likes: [],
                bio: '',
                posts: [],
                followers: [],
                following: []
            }
        }
    })
}

async function main() {
    try {
        const People = loadPeople()
        for (let person of People) {            
            // Encrypt the password
            const hashedPw = await bcrypt.hash(person.data.password, 12)

            // Create a new user
            let user = new User(person.data)
  
            user.password = hashedPw

            await user.save()
            .catch(e => console.error(`Error trying to seed database: ${e} person: ${person}`))
        }
    } catch (err) {
        console.log(err)
    }
}

main()
    .catch(e => console.error(e))
        .finally(async () => {
        await mongoose.disconnect()
    })