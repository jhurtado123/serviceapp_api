const User = require('../models/User');
const Reward = require('../models/Reward');
const Ad = require('../models/Ad');
const createNofifications = require('../middlewares/notificationMiddleware');

const rewardsMiddleware = {

  checkProfileCompletedReward : async function (id, options) {
    if (options.name !== '' && options.description !== '' && options.address !== ''){
    try{
      const user = await User.findOne({'_id': id})
      const reward = await Reward.findOne({'type': 'profile'})
      let newPoints = user.points + reward.points
      if (user.rewards.includes(reward._id) === false ){
        user.rewards.push(reward)
            await User.findOneAndUpdate({'_id': id}, {'rewards': user.rewards, 'points': newPoints})
        createNofifications(id, { 'title': 'Recompensa por completar tu perfil', 'href': '/profile/rewards', 'type': 'reward'})
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
      const reward = await Reward.find({ "type": "ad", "total": { $lte: numAds }})
      console.log("RECOMEPNSAS", reward)
      if (user.rewards.includes(reward[0]._id) === false) {
        user.rewards.push(reward[0])
        let newPoints = user.points + reward[0].points
        await User.findOneAndUpdate({ '_id': user._id }, { 'rewards': user.rewards, 'points': newPoints })
        createNofifications(id, { 'title': `Recompensa por ${numAds} anuncios`, 'href': '/profile/rewards', 'type': 'reward' })
      }
    }
    catch (error) {
      console.log(error);
    }
  }
}



module.exports = rewardsMiddleware;
