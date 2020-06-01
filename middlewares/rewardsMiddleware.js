const User = require('../models/User');
const Reward = require('../models/Reward');
const Ad = require('../models/Ad');
const Level = require('../models/Level');
const createNofifications = require('../middlewares/notificationMiddleware');

const rewardsMiddleware = {

  checkProfileCompletedReward : async function (id, options) {
    if (options.name !== '' && options.description !== '' && options.address !== ''){
    try{
      const user = await User.findOne({'_id': id})
      const reward = await Reward.findOne({'type': 'profile'})
      const level  = await Level.findOne({ "maxpoints": { $gte: user.points }, "minpoints": { $lte: user.points } });
      let newPoints = user.points + reward.points;
      if (user.rewards.includes(reward._id) === false ){
        user.rewards.push(reward)
        if (newPoints > level.maxpoints || newPoints == level.maxpoints) {
          let newSerkens = user.wallet.tokens + level.reward
          console.log(newSerkens)
          await User.findOneAndUpdate({ '_id': user._id }, { 'rewards': user.rewards, 'points': newPoints, 'wallet': {'tokens': newSerkens} })
        } else {
          await User.findOneAndUpdate({'_id': id}, {'rewards': user.rewards, 'points': newPoints})
        }
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
      const level = await Level.findOne({ "maxpoints": { $gte: user.points }, "minpoints": { $lte: user.points } });
      let numAds = (ads.length)
      const reward = await Reward.find({ "type": "ad", "total": { $lte: numAds }})
      if (user.rewards.includes(reward[0]._id) === false) {
        user.rewards.push(reward[0])
        let newPoints = user.points + reward[0].points;
        if (newPoints > level.maxpoints || newPoints == level.maxpoints) {
          let newSerkens = user.wallet.tokens + level.reward
          await User.findOneAndUpdate({ '_id': user._id }, { 'rewards': user.rewards, 'points': newPoints, 'wallet': {'tokens': newSerkens} })
        } else {
          await User.findOneAndUpdate({ '_id': user._id }, { 'rewards': user.rewards, 'points': newPoints })
        }
        createNofifications(id, { 'title': `Recompensa por ${numAds} anuncios`, 'href': '/profile/rewards', 'type': 'reward' })
      }
    }
    catch (error) {
      console.log(error);
    }
  }
}



module.exports = rewardsMiddleware;
