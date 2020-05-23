const User = require('../models/User');
const Reward = require('../models/Reward');
const Ad = require('../models/Ad');
const createNofifications = require('../middlewares/notificationMiddleware');

const rewardsMiddleware = {

  checkProfileCompletedReward : async function (id, options) {
    console.log("LAS OPTIONS", options)
    if (options.name !== '' && options.description !== '' && options.address !== ''){
      console.log("ENTRA")
    try{
      const user = await User.findOne({'_id': id})
      const reward = await Reward.findOne({'type': 'profile'})
      console.log("El reward", reward)
      console.log("Las rewards", user.rewards)
      let newPoints = user.points + reward.points
      if (user.rewards.includes(reward._id) === false ){
        console.log("EEEE", user.rewards)
        user.rewards.push(reward)
            await User.findOneAndUpdate({'_id': id}, {'rewards': user.rewards, 'points': newPoints})
            createNofifications(id, {'title': 'Has obtenido una recompensa', 'href': '/profile/rewards', 'type': 'reward'})
        }
      }
      catch(err) {
        console.log(err);
      }
    }
  }, 
  checkAdsReward : async function (id) {
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
      } else{
        console.log("YA TIENES")
      }
    }
    catch (error) {
      console.log(error);
    }
  }
}



module.exports = rewardsMiddleware;
