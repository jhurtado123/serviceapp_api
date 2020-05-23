const User = require('../models/User');
const Reward = require('../models/Reward');
const Ad = require('../models/Ad');
const createNofifications = require('../middlewares/notificationMiddleware');


module.exports = async function checkProfileCompletedReward(id, options) {
  if (options.name !== '' && options.description !== '' && options.address !== '' && options.profile != ''){
  try{
    const user = await User.findOne({'_id': id})
    const reward = await Reward.findOne({'type': 'profile'})
    let newRewards = [];
    newRewards.push(reward)
    let newPoints = user.points + reward.points
      if (!user.rewards.includes(reward._id)){
          await User.findOneAndUpdate({'_id': id}, {'rewards': newRewards, 'points': newPoints})
          createNofifications(id, {'title': 'Has obtenido una recompensa', 'href': '/profile/rewards', 'type': 'reward'})
      }
    }
    catch(err) {
      console.log(err);
    }
  }
}

module.exports = async function checkAdsReward(id) {
  try {
    const ads = await Ad.find({ owner: id }).populate("owner");
    const user = await User.findOne({ '_id': id })
    let numAds = (ads.length)
    console.log(numAds)
    const reward = await Reward.find({ "type": "ad", "total": { $lte: numAds }})
    if (user.rewards.includes(reward[0]._id) === false) {
      user.rewards.push(reward[0])
      let newPoints = user.points + reward[0].points
      await User.findOneAndUpdate({ '_id': user._id }, { 'rewards': user.rewards, 'points': newPoints })
      createNofifications(id, { 'title': 'Has obtenido una recompensa', 'href': '/profile/rewards', 'type': 'reward' })
    }
  }
  catch (error) {
    console.log(error);
  }
}