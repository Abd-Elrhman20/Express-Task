const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())

// Get all revenues of all members.
app.get("/allRevenue", (req, res) => {
    const members = JSON.parse(fs.readFileSync('./public/members.json', 'utf8'))
    let totalRevenue = 0
    members.map((member) => { totalRevenue += member.membership.cost })
    res.send(`Members Total revenue: ${totalRevenue}$`)
})
// Get a specific revenues of a member.
app.get("/revenue/:id", (req, res) => {
    const { id } = req.params
    console.log(id);
    const members = JSON.parse(fs.readFileSync('./public/members.json', 'utf8'))
    const member = members.find((member) => member.id === (+id))
    console.log(member);
    res.send(`revenue: ${member.membership.cost}$`)
})
// //////////////////////////////////////////////////////////
app.route('/members')
    .post((req, res) => {
        const members = JSON.parse(fs.readFileSync('./public/members.json', 'utf8'))
        console.log(req.body);
        members.push(req.body)
        fs.writeFileSync('./public/members.json', JSON.stringify(members))
        res.send('Member added')
    })
    // Add member using req.body
    .get((req, res) => {
        const members = JSON.parse(fs.readFileSync('./public/members.json', 'utf8'))
        res.send(members)
    })

// get a specific Member
app.route('/members/:id')
    .get(
        (req, res, next) => {      //* middleware to check if the member is active or not
            const { id } = req.params
            const members = JSON.parse(fs.readFileSync('./public/members.json', 'utf8'))
            const member = members.find((member) => member.id === (+id))
            if (member.status === 'active') {
                next()
            } else {
                res.send('this member is not allowed to enter the gym')
            }
        },
        (req, res) => {
            const { id } = req.params
            const members = JSON.parse(fs.readFileSync('./public/members.json', 'utf8'))
            const member = members.find((member) => member.id === (+id))
            res.send(member)
        })
    // Update Member (name, membership, trainer id)
    .put((req, res) => {
        const { id } = req.params
        const members = JSON.parse(fs.readFileSync('./public/members.json', 'utf8'))
        const memberIndex = members.findIndex((member) => member.id === (+id))
        members[memberIndex] = {...members[memberIndex], ...req.body}
        //! xxxxxxxxx   Wrong way  xxxxxxxxx
        // member.id = req.body.id ? req.body.id : member.id
        // member.name = req.body.name ? req.body.name : member.name
        // member.nationalID = req.body.nationalId ? req.body.nationalId : member.nationalId
        // member.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : member.phoneNumber
        // member.membership = req.body.membership ? req.body.membership : member.membership
        // member.status = req.body.status ? req.body.status : member.status
        // member.trainerId = req.body.trainerId ? req.body.trainerId : member.trainerId
        //! xxxxxxxxx  Wrong way   xxxxxxxxx
        fs.writeFileSync('./public/members.json', JSON.stringify(members))
        res.send('Member updated')
    })
    // Delete Member
    .delete((req, res) => {
        const { id } = req.params
        const members = JSON.parse(fs.readFileSync('./public/members.json', 'utf8'))
        let member = members.find((member) => member.id === (+id))
        console.log(member.id);
        members.splice((member.id - 1), 1)
        fs.writeFileSync('./public/members.json', JSON.stringify(members))
        res.send('Member deleted')
    })


// //////////////////////////////////////////////////////////
app.route('/trainer')
    // Get all trainers
    .get((req, res) => {
        const trainers = JSON.parse(fs.readFileSync('./public/trainers.json', 'utf8'))
        res.send(trainers)
    })
    // Add a trainer.
    .post((req, res) => {
        const trainers = JSON.parse(fs.readFileSync('./public/trainers.json', 'utf8'))
        trainers.push(req.body)
        fs.writeFileSync('./public/trainers.json', JSON.stringify(trainers))
        res.send('Trainer added')
    })

app.route('/trainer/:id')
    // Get a specific trainer 
    .get((req, res) => {
        const { id } = req.params
        const trainers = JSON.parse(fs.readFileSync('./public/trainers.json', 'utf8'))
        const trainer = trainers.find((trainer) => trainer.id === (+id))
        res.send(trainer)
    })
    // Update Trainer
    .put((req, res) => {
        const { id } = req.params
        const trainers = JSON.parse(fs.readFileSync('./public/trainers.json', 'utf8'))
        const trainer = trainers.find((trainer) => trainer.id === (+id))
        //! xxxxxxxxx   Wrong way  xxxxxxxxx
        trainer.id = req.body.id ? req.body.id : trainer.id
        trainer.name = req.body.name ? req.body.name : trainer.name
        trainer.duration = req.body.duration ? req.body.duration : trainer.duration
        //! xxxxxxxxx  Wrong way   xxxxxxxxx
        fs.writeFileSync('./public/trainers.json', JSON.stringify(trainers))
        res.send("trainer updated")
    })
    // Delete Trainer
    .delete((req, res) => {
        const { id } = req.params
        const trainers = JSON.parse(fs.readFileSync('./public/trainers.json', 'utf8'))
        let trainer = trainers.find((trainer) => trainer.id === (+id))
        trainers.splice((trainer.id - 1), 1)
        fs.writeFileSync('./public/trainers.json', JSON.stringify(trainers))
        res.send('Trainer deleted')
    })

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})