// // Defines helper functions for saving and getting tweets, using the database `db`
// module.exports = function DataHelpers(db) {
//   return {

//     // Saves a tweet to `db`
//     saveMap: function(newTweet, callback) {
//       simulateDelay(() => {
//         db.tweets.push(newTweet);
//         callback(null, true);
//       });
//     },

//     // Get all tweets in `db`, sorted by newest first
//     getTweets: function(callback) {
//       simulateDelay(() => {
//         const sortNewestFirst = (a, b) => a.created_at - b.created_at;
//         callback(null, db.tweets.sort(sortNewestFirst));
//       });
//     }

//   };
// }