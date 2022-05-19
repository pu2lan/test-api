const path = require ('path');
const fs = require ('fs');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

const users = [
    { user: 'tap', amount: 0 },
    { user: 'pat', amount: 0 },
    { user: 'test', amount: 0 }
]

var uname = '';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html',  'login.html'));
});

app.get ('/home', (req, res) => {
    uname = req.query.uname;
    //const user = users.find(u => u.user === uname);
    //if (!user) res.send('Unregistered Account!');
    //else 
    res.sendFile(path.join(__dirname, 'html',  'home.html'));
});

app.post('/cashin', (req, res) => {
    const user = users.find(u => u.user === uname);
    var cashin = !req.body.cashin ? 0 : parseInt(req.body.cashin) ;
    //unregistered
    if (!user) {
        const uuser = {
            user: uname,
            amount: cashin
        };
        users.push(uuser);
        res.send('You have cashed in ' + uuser.amount + ' pesos on your ' + uuser.user + ' account.');
    } else {
        //cashin
        if (req.body.cashin > 0 ) {

            user.amount += cashin;
        }

        res.send('You have cashed in ' + cashin + ' pesos on your ' + uname + ' account.');
    }
});

app.post('/debit', (req, res) => {
    const user = users.find(u => u.user === uname);
    //debit
    if (req.body.debit > 0) {
        var debit = parseInt(req.body.debit);

        if (user.amount >= debit) {
            user.amount -= debit;
            res.send(debit + ' pesos has been debited on your ' + uname + ' account.');
        } else {
            res.send('Insufficient Balance!');
        }
    } else res.send('Invalid Amount!');
});

app.post('/balance', (req, res) => {
    const user = users.find(u => u.user === uname);
    const amount = !user ? 0 : user.amount;
    res.send(uname + ' account : ' + amount + ' pesos');
});


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
