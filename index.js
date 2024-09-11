const axios = require('axios');
const { keep_alive } = require('./keep_alive.js');
const accessToken = 'EAAD6V7os0gcBO2Px1aVBKnnE1N8b6ZArkMlk8hcrY7oSVgb7ARYeZBwJNOZAZChT4ThnJNzYno7ClVJnsmZAZAPdK1wmjneGHZC8JH5VncJdTRZBdBKZABZBxXeV5VraJZCNUq6FBR1uyyZBt5qJCa7Y2JE4LCy8OvmKbQUipZBpJE5xyQNa5kT0ozb6GzTzFyCIX26GNiwZDZD';//TOKEN HERE
const shareUrl = 'https://www.facebook.com/100095290150085/posts/pfbid032myEgzBC8noYnrDgpiQP8xDPC4P8zfmt9StKmN1xbVvYEcAsCVTNRJiFRYU9kwFql/?app=fbl';//URL HERE
const shareCount = 100000;
const timeInterval = 1100;
const deleteAfter = 60 * 60;

let sharedCount = 0;
let timer = null;

async function sharePost() {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/me/feed?access_token=${accessToken}&fields=id&limit=1&published=0`,
      {
        link: shareUrl,
        privacy: { value: 'SELF' },
        no_story: true,
      },
      {
        muteHttpExceptions: true,
        headers: {
          authority: 'graph.facebook.com',
          'cache-control': 'max-age=0',
          'sec-ch-ua-mobile': '?0',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
          },
          method: 'post',
      }
    );

    sharedCount++;
    const postId = response?.data?.id;

    console.log(`Boost Count: ${sharedCount}`);
    console.log(`Post ID: ${postId || 'Unknown'}\nSuccesfully Boost Shared✓`);

    if (sharedCount === shareCount) {
      clearInterval(timer);
      console.log('Finished sharing posts.');

      if (postId) {
        setTimeout(() => {
          deletePost(postId);
        }, deleteAfter * 1000);
      }
    }
  } catch (error) {
    console.error('Failed to share post:', error.response.data);
  }
}

async function deletePost(postId) {
  try {
    await axios.delete(`https://graph.facebook.com/${postId}?access_token=${accessToken}`);
    console.log(`Post deleted: ${postId}`);
  } catch (error) {
    console.error('Failed to delete post:', error.response.data);
  }
}

timer = setInterval(sharePost, timeInterval);

setTimeout(() => {
  clearInterval(timer);
  console.log('Loop stopped.');
}, shareCount * timeInterval); 
