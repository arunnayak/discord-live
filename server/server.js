const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Pusher = require('pusher');
const mongoData = require("./mongoData");

// app config
const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(express.json());
app.use(cors());

// pusher settings
const pusher = new Pusher({
    appId: '1092466',
    key: 'cc0997514c23c137f87d',
    secret: 'fafed2dd8a0f51cbb578',
    cluster: 'ap1',
    encrypted: true
  });

// db config
const mongoURI = 'mongodb+srv://admin:yhbtruGEi6SPdAIp@cluster0.liggv.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
    console.log('connected');

    const changeStream = mongoose.connection.collection('conversations').watch();

    changeStream.on('change', (change) => {
        console.log('change', change);
        // creating a channel is inseting a document and messaging is updating a exsting doc with the message
        if (change.operationType === 'insert') {
            pusher.trigger('channels', 'newChannel', {
                'change': change
            })
        } else if (change.operationType === 'update') {
            pusher.trigger('conversation', 'newMessage', {
                'change': change
            })
        } else {
            console.log('Error triggering pusher');
        }
    })
})
// api routes
app.get('/', (req, res) => res.status(200).send('Hellow world'));

// post
app.post('/new/channel', (req, res) => {
    const data = req.body;

    mongoData.create(data, ( err , data ) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(200).send(data);
    });
});

app.post('/new/message', (req, res) => {
    const id = req.query.id;
    const newMessage = req.body;

    mongoData.update(
        { _id: id },
        { $push: { conversation: newMessage } },
        (err, data) => {
            if (err) {
                res.status(500).send(`${err}, saving data`);
                return;
            }

            res.status(200).send(data);
        }
    );
});

// get
app.get('/get/channels', (req, res) => {

    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        let channles = [];

        data.map((channelData) => {
            const channelInfo = {
                id: channelData._id,
                name: channelData.channelName
            }
            channles.push(channelInfo);
        })
        res.status(200).send(channles);
    })
});

app.get('/get/conversation', (req, res) => {

    const id = req.query.id;
    mongoData.find({_id: id}, (err, data) => {
        if (err) {
            res.status(500).send(`${err}, getting conversation`);
            return;
        }

        res.status(200).send(data);
    })

});


// listen
app.listen(port, () => console.log(`app is listening on ${port}`));