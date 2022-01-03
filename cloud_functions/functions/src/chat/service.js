const createTopic = async (pubSubClient, topicName) => {
  await pubSubClient.createTopic(topicName);
};

const createSubscription = async (
  pubSubClient,
  topicName,
  subscriptionName
) => {
  await pubSubClient.topic(topicName).createSubscription(subscriptionName);
};

const publishMessage = async (pubSubClient, topicName, payload) => {
  try {
    const dataBuffer = Buffer.from(JSON.stringify(payload));
    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);

    // let subscriptionList = [];
    // pubSubClient.getSubscriptions().then(function (data) {
    //   if (data && data[0]) {
    //     Object.values(data[0]).forEach((value) => {
    //       console.log(value["name"]);
    //       let fullName = value["name"];
    //       if (fullName) {
    //         let arr = fullName.split("/");
    //         if (arr && arr.length > 3) {
    //           let name = arr[3];
    //           subscriptionList.push(name);
    //         }
    //       }
    //     });
    //     console.log(subscriptionList);
    //   }
    // });

    return messageId;
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
    process.exitCode = 1;
  }
};

const listenForPullMessages = (pubSubClient, subscriptionName, timeout) => {
  const subscription = pubSubClient.subscription(subscriptionName);
  let messageCount = 0;
  const messageHandler = (message) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;
    message.ack();
  };
  subscription.on("message", messageHandler);
  setTimeout(() => {
    subscription.removeListener("message", messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
};

const listenForPushMessages = (payload) => {
  const message = Buffer.from(payload, "base64").toString("utf-8");
  return message;
};

module.exports = {
  publishMessage,
  listenForPullMessages,
  listenForPushMessages,
  createSubscription,
  createTopic,
};
