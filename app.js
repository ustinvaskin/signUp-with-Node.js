const express = require('express')
const bodyParser = require('body-parser')
const https = require('https');
const { Http2ServerRequest } = require('http2');
const app = express()
// const port = process.env.PORT;

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
  const firstName = req.body.FirstName
  const lastName = req.body.LastName
  const email = req.body.email
  // Data that will beed to be assebvled to semnd to mailchimp 
  // https://mailchimp.com/developer/api/marketing/list-members/ 
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  // we want to post data to an external server
  const jsonData = JSON.stringify(data)
  // creating request 
  // main urs with list id 
  const listId = '8d7a978d13'
  const url = `https://us17.api.mailchimp.com/3.0/lists/${listId}`

  const options = {
    method: 'POST',
    auth: 'ustinvaskinm:75857d7658521fc8d29d05b48b769357-us17'
  }

  const request = https.request(url, options, (response) => {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + '/success.html')
    } else {
      res.sendFile(__dirname + '/failure.html')
    }

    response.on('data', (d) => {
      console.log(JSON.parse(d))
    })
  })

  request.write(jsonData)
  request.end()
})

app.post('/failure', (req, res) => {
  res.redirect('/')
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listenng to port ${process.env.PORT}`)
})


// API key
//75857d7658521fc8d29d05b48b769357-us17

// list id 
// 8d7a978d13