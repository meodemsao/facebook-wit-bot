var Botkit = require('botkit');
var Witbot = require('witbot');

var facebookToken = process.env.FACEBOOK_VERIFY_TOKEN;
var verifyToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
var witbot = Witbot(process.env.WIT_TOKEN);
var controller = Botkit.facebookbot({ 
  debug: false,
  access_token: facebookToken,
  verify_token: verifyToken
});

controller.spawn({}).startRTM(function (err, bot, payload) {
  if (err) throw new Error('Error connecting to Facebook: ', err);
  console.log('Connected to Facebook');
})

// wire up DMs and direct mentions to wit.ai
controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
  var wit = witbot.process(message.text, bot, message)

  wit.hears('hello', 0.53, function (bot, message, outcome) {
    bot.startConversation(message, function (_, convo) {
      convo.say('Hello!')
      convo.ask('How are you?', function (response, convo) {
        witbot.process(response.text)
          .hears('good', 0.5, function (outcome) {
            convo.say('I am so glad to hear it!')
            convo.next()
          })
          .hears('bad', 0.5, function (outcome) {
            convo.say('I\'m sorry, that is terrible')
            convo.next()
          })
          .otherwise(function (outcome) {
            convo.say('I\'m cofused')
            convo.repeat()
            convo.next()
          })
      })
    })
  })

  wit.otherwise(function (bot, message) {
    bot.reply(message, 'You are so intelligent, and I am so simple. I don\'t understnd')
  })
})