/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/
This is a sample Slack bot built with Botkit.
This bot demonstrates many of the core features of Botkit:
* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.
# RUN THE BOT:
  Get a Bot token from Slack:
    -> http://my.slack.com/services/new/bot
  Get a Wit token from Wit.ai
    -> https://wit.ai/apps/new
  Run your bot from the command line:
    wit=<MY WIT TOKEN> token=<MY TOKEN> node bot.js
# USE THE BOT:
  Train a "hello" intent inside Wit.ai.  Give it a bunch of examples
  of how someone might say "Hello" to your bot.
  Find your bot inside Slack to send it a direct message.
  Say: "Hello"
  The bot should reply "Hello!" If it didn't, your intent hasn't been
  properly trained - check out the wit.ai console!
  Make sure to invite your bot into other channels using /invite @<my bot>!
# EXTEND THE BOT:
  Botkit is has many features for building cool and useful bots!
  Read all about it here:
    -> http://howdy.ai/botkit
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.FACEBOOK_VERIFY_TOKEN) {
    console.log('Error: Specify FACEBOOK_VERIFY_TOKEN in environment');
    process.exit(1);
}

if (!process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
    console.log('Error: Specify FACEBOOK_PAGE_ACCESS_TOKEN in environment');
    process.exit(1);
}

if (!process.env.WIT_TOKEN) {
    console.log('Error: Specify wit in environment');
    process.exit(1);
}

var Botkit = require('botkit');
var wit = require('botkit-middleware-witai')({
    token: process.env.WIT_TOKEN
});


var controller = Botkit.facebookbot({
    debug: true,
    access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    verify_token: process.env.FACEBOOK_VERIFY_TOKEN
});

var bot = controller.spawn({});

controller.middleware.receive.use(wit.receive);

controller.setupWebserver(process.env.port || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
    });
});


/* note this uses example middlewares defined above */
controller.hears(['hello'], 'message_received,direct_message,direct_mention,mention', wit.hears, function(bot, message) {
    bot.reply(message, 'Hello!');
});

controller.on('message_received', function(bot, message) {
    bot.reply(message, 'Try: `what is my name` or `structured` or `call me captain`');
    return false;
});
