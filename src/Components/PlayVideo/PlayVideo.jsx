import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import user_profile from '../../assets/user_profile.jpg';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';


const PlayVideo = ({ videoId }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchVideoData = async () => {
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    await fetch(videoDetailsUrl)
      .then(res => res.json())
      .then(data => setApiData(data.items[0]));
  };

  const fetchChannelData = async (channelId) => {
    const channelDataUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${API_KEY}`;
    await fetch(channelDataUrl)
      .then(response => response.json())
      .then(data => setChannelData(data.items[0]));
  };

  const fetchCommentData = async (videoId) => {
    const commentDataUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
    await fetch(commentDataUrl)
      .then(response => response.json())
      .then(data => setCommentData(data.items));
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    if (apiData) {
      fetchChannelData(apiData.snippet.channelId);
      fetchCommentData(videoId);
    }
  }, [apiData]);

  return (
    <div className='play-video'>
      <iframe 
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`} 
        allow="autoplay" 
        allowFullScreen
        title="Video Player"
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : 'title'}</h3>
      <div className="play-video-info">
        <p className="views-time">
          {apiData ? value_converter(apiData.statistics.viewCount) : '16K'} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ''}
        </p>
        <div>
          <span><img src={like} alt="like" />{apiData ? value_converter(apiData.statistics.likeCount) : '155'}</span>
          <span><img src={dislike} alt="dislike" /></span>
          <span><img src={share} alt="share" />Share</span>
          <span><img src={save} alt="save" />Save</span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData ? channelData.snippet.thumbnails.default.url : ''} alt="channel" />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ''}</p>
          <span>{channelData ? `${value_converter(channelData.statistics.subscriberCount)} Subscribers` : '1M Subscribers'}</span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData ? `${apiData.snippet.description.slice(0, 250)}...` : "Description"}</p>
        <hr />
        <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} Comments</h4>
        {commentData.map((comment, index) => (
          <div className="comment" key={index}>
            <img src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="user profile" />
            <div>
              <h3>{comment.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(comment.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
              <p>{comment.snippet.topLevelComment.snippet.textDisplay}</p>
              <div className="comment-action">
                <img src={like} alt="like" />
                <span>{value_converter(comment.snippet.topLevelComment.snippet.likeCount)}</span>
                <img src={dislike} alt="dislike" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayVideo;
