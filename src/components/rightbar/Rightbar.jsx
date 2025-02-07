
import './rightbar.css';
import { Users } from '../../dummyData';
import Online from '../online/Online';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove } from '@material-ui/icons';
import {
  DialogTitle,
  Dialog,
  FormControl,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@mui/material';

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [open, setOpen] = useState(false);

  const { user: currentUser, dispatch } = useContext(AuthContext);

  // const [followed, setFollowed] = useState(async () => {
  //   return await currentUser.followings.includes(user?.id);
   
  // });
  const [followed, setFollowed]=useState(false)

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?.id))},[currentUser,user])
console.log('currentUser',currentUser);
console.log('user',user);
console.log('followed',followed);
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get('/users/friends/' + user.id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user.id}/unfollow`, {
          userId:""+ currentUser.id,
        });
        dispatch({ type: 'UNFOLLOW', payload: user.id });
       
      }
      
      else {
        await axios.put(`/users/${user.id}/follow`, {
          userId:""+ currentUser.id,
        });
        dispatch({ type: 'FOLLOW', payload: user.id });
       
      }
      
    } catch (err) {}
    setFollowed(!followed);
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className='birthdayContainer'>
          {/* <img className="birthdayImg" src="assets/gift.png" alt="" /> */}
          <span className='birthdayText'>
            {/* <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today. */}
          </span>
        </div>
        {/* <img className="rightbarAd" src="assets/ad.png" alt="" /> */}
        <h4 className='rightbarTitle'>Online Friends</h4>
        <ul className='rightbarFriendList'>
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const SimpleDialog = (props) => {
    const { onClose, selectedValue, open } = props;

    let city = '',
      from = '',
      relationship = '';

    const handleCity = (e) => {
      e.preventDefault();
      city = e.target.value;
      // setUserCity(e.target.value);
    };
    const handleFrom = (e) => {
      e.preventDefault();
      from = e.target.value;
      // setUserFrom(e.target.value);
    };
    const handleRelationship = (e) => {
      e.preventDefault();
      relationship = e.target.value;
      // setUserRelationship(e.target.value);
    };

    const updateInfo = (e) => {
      e.preventDefault();

      axios
        .put(`/users/${currentUser.id}`, {
          userId: currentUser.id,
          city: city,
          from: from,
          relationship: relationship,
        })
        .then(function (response) {
          window.location.reload(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    const handleClose = () => {
      onClose(selectedValue);
    };

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Update user info</DialogTitle>
        <FormControl>
          <TextField
            defaultValue={user ? user.city : ''}
            onChange={handleCity}
            id='city'
            label='City'
            variant='outlined'
          />
          <TextField
            defaultValue={user ? user.from : ''}
            onChange={handleFrom}
            id='from'
            label='From'
            variant='outlined'
          />
          <TextField
            id='relationship'
            defaultValue={user ? user.relationship : ''}
            label='Relationship'
            select
            onChange={handleRelationship}
          >
            <MenuItem value='1'>Single</MenuItem>
            <MenuItem value='2'>Married</MenuItem>
            <MenuItem value='3'>Other</MenuItem>
          </TextField>
          <Button type='submit' onClick={updateInfo}>
            Update
          </Button>
        </FormControl>
      </Dialog>
    );
  };

  const ProfileRightbar = () => {
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = (value) => {
      setOpen(false);
    };
    console.log('followed',followed);
    return (
      <>
        {user.username !== currentUser.username && (
      
          <button className='rightbarFollowButton' 
         
          onClick={handleClick}>
           {followed ? "Unfollow" : "Follow"}
    {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className='rightbarTitle' onClick={handleClickOpen}>
          User information
        </h4>
        <SimpleDialog
          selectedValue={'selectedValue'}
          open={open}
          onClose={handleClose}
        />
        <div className='rightbarInfo'>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>City:</span>
            <span className='rightbarInfoValue'>{user.city}</span>
          </div>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>From:</span>
            <span className='rightbarInfoValue'>{user.from}</span>
          </div>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>Relationship:</span>
            <span className='rightbarInfoValue'>
              {user.relationship === '1'
                ? 'Single'
                : user.relationship === '2'
                ? 'Married'
                : '-'}
            </span>
          </div>
        </div>
        <h4 className='rightbarTitle'>User friends</h4>
        <div className='rightbarFollowings'>
          {friends.map((friend) => (
            <Link
              to={'/profile/' + friend.username}
              style={{ textDecoration: 'none' }}
            >
              <div className='rightbarFollowing'>
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + 'person/noAvatar.png'
                  }
                  alt=''
                  className='rightbarFollowingImg'
                />
                <span className='rightbarFollowingName'>{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className='rightbar'>
      <div className='rightbarWrapper'>
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}


// import "./rightbar.css";
// import { Users } from "../../dummyData";
// import Online from "../online/Online";
// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import { Add, Remove } from "@material-ui/icons";

// export default function Rightbar({ user }) {
//   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
//   const [friends, setFriends] = useState([]);
//   const { user: currentUser, dispatch } = useContext(AuthContext);
//   const [followed, setFollowed] = useState(
//     currentUser.followings.includes(user?.id)
//   );
  


//   useEffect(() => {
//     const getFriends = async () => {
//       try {
//         const friendList = await axios.get("/users/friends/" + user.id);
//         setFriends(friendList.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     getFriends();
//   }, [user]);

//   const handleClick = async () => {
//     try {
//       if (followed) {
//         await axios.put(`/users/${user.id}/unfollow`, {
//           userId:""+ currentUser.id,
//         });
//         dispatch({ type: "UNFOLLOW", payload: user.id });
//       } else {
//         await axios.put(`/users/${user.id}/follow`, {
//           userId:""+  currentUser.id,
//         });
//         dispatch({ type: "FOLLOW", payload: user.id });
//       }
//       console.log('before',followed);
//       //
    
  
//       console.log('afterrrrrrr',followed);
//     } catch (err) {
//       console.log('erooooooooooooor',err);
//     }
//     setFollowed(!followed);
//   };

//   const HomeRightbar = () => {
//     return (
//       <>
//         <div className="birthdayContainer">
//           <img className="birthdayImg" src="assets/gift.png" alt="" />
//           <span className="birthdayText">
//             <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
//           </span>
//         </div>
//         <img className="rightbarAd" src="assets/ad.png" alt="" />
//         <h4 className="rightbarTitle">Online Friends</h4>
//         <ul className="rightbarFriendList">
//           {Users.map((u) => (
//             <Online key={u.id} user={u} />
//           ))}
//         </ul>
//       </>
//     );
//   };

//   const ProfileRightbar = () => {
//     console.log('user',user.username);
//     console.log('current',currentUser.username);
//     return (
//       <>
        
//         {user?.id !== currentUser.id && (
       
//           <button className="rightbarFollowButton" onClick={handleClick}>
//             {followed ? "Unfollow" : "Follow"}
//             {followed ? <Remove /> : <Add />}
//           </button>
//         )}
//         <h4 className="rightbarTitle">User information</h4>
//         <div className="rightbarInfo">
//           <div className="rightbarInfoItem">
//             <span className="rightbarInfoKey">City:</span>
//             <span className="rightbarInfoValue">{user.city}</span>
//           </div>
//           <div className="rightbarInfoItem">
//             <span className="rightbarInfoKey">From:</span>
//             <span className="rightbarInfoValue">{user.from}</span>
//           </div>
//           <div className="rightbarInfoItem">
//             <span className="rightbarInfoKey">Relationship:</span>
//             <span className="rightbarInfoValue">
//               {user.relationship === 1
//                 ? "Single"
//                 : user.relationship === 1
//                 ? "Married"
//                 : "-"}
//             </span>
//           </div>
//         </div>
//         <h4 className="rightbarTitle">User friends</h4>
//         <div className="rightbarFollowings">
//           {friends.map((friend) => (
//             <Link
//               to={"/profile/" + friend.username}
//               style={{ textDecoration: "none" }}
//             >
//               <div className="rightbarFollowing">
//                 <img
//                   src={
//                     friend.profilePicture
//                       ? PF + friend.profilePicture
//                       : PF + "person/noAvatar.png"
//                   }
//                   alt=""
//                   className="rightbarFollowingImg"
//                 />
//                 <span className="rightbarFollowingName">{friend.username}</span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </>
//     );
//   };
//   return (
//     <div className="rightbar">
//       <div className="rightbarWrapper">
//         {user ? <ProfileRightbar /> : <HomeRightbar />}
//       </div>
//     </div>
//   );
// }
// // import "./rightbar.css";
// // import { Users } from "../../dummyData";
// // import Online from "../online/Online";
// // import { useContext, useEffect, useState } from "react";
// // import axios from "axios";
// // import { Link } from "react-router-dom";
// // import { AuthContext } from "../../context/AuthContext";
// // import { Add, Remove } from "@material-ui/icons";

// // export default function Rightbar({ user }) {
// //   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
// //   const [friends, setFriends] = useState([]);
// //   const { user: currentUser, dispatch } = useContext(AuthContext);
// //   console.log("currentUser.followings",currentUser.followings);
// //   const [followed, setFollowed] = useState(
// //     currentUser.followings.includes(""+ user?.id)
  
// //   );

// // //   console.log(" currentUser", currentUser);
// // //   console.log("currentUser.followings",currentUser.followings);
// // //  console.log("user.id",user.id);
// // //  console.log(user.id);
// // //  console.log(typeof(user?.id+""));




// // console.log("followed=============>",followed);
// //   useEffect(() => {
// //     const getFriends = async () => {
// //       try {
// //         const friendList = await axios.get("/users/friends/" +user.id);
// //         setFriends(friendList.data);
// //       } catch (err) {
// //         console.log(err);
// //       }
// //     };
// //     getFriends();
// //     console.log("hhhhhhhhhhhhhhhhhhhhhhhhh",currentUser);
// //   }, [user]);



// //   const handleClick = async () => {
// //     try {
// //       if (followed) {
// //         await axios.put(`/users/${user.id}/unfollow`, {
// //           userId: ""+ currentUser.id,
// //         });
// //         dispatch({ type: "UNFOLLOW", payload: user.id });
// //       } else {
// //         await axios.put(`/users/${user.id}/follow`, {
// //           userId: ""+ currentUser.id,
// //         });
// //         dispatch({ type: "FOLLOW", payload: user.id });
// //       }
// //       setFollowed(!followed);
// //     } catch (err) {
// //     }
// //   };

// //   const HomeRightbar = () => {
// //     return (
// //       <>
// //         <div className="birthdayContainer">
// //           {/* <img className="birthdayImg" src="public/assets/dev.png" alt="" /> */}
// //           <span className="birthdayText">
// //             {/* <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today. */}
// //           </span>
// //         </div>
// //         <img className="rightbarAd" src="assets/dev.png" alt="" />
// //         <h4 className="rightbarTitle">Online Friends</h4>
// //         <ul className="rightbarFriendList">
// //           {Users.map((u) => (
// //             <Online key={u.id} user={u} />
// //           ))}
          
// //         </ul>
// //       </>
// //     );
// //   };

// //   const ProfileRightbar = () => {
// //     return (
// //       <>
// //         {user.username !== currentUser.username && (
// //           <button className="rightbarFollowButton" onClick={handleClick}>
// //             {followed ? "Unfollow" : "Follow"}
// //             {followed ? <Remove /> : <Add />}
// //           </button>
// //         )}
// //         <h4 className="rightbarTitle">User information</h4>
// //         <div className="rightbarInfo">
// //           <div className="rightbarInfoItem">
// //             <span className="rightbarInfoKey">City:</span>
// //             <span className="rightbarInfoValue">{user.city}</span>
// //           </div>
// //           <div className="rightbarInfoItem">
// //             <span className="rightbarInfoKey">From:</span>
// //             <span className="rightbarInfoValue">{user.from}</span>
// //           </div>
// //           <div className="rightbarInfoItem">
// //             <span className="rightbarInfoKey">Relationship:</span>
// //             <span className="rightbarInfoValue">
// //               {user.relationship === "1"
// //                 ? "Single"
// //                 : user.relationship === "2"
// //                 ? "Married"
// //                 : "-"}
// //             </span>
// //           </div>
// //         </div>
// //         <h4 className="rightbarTitle">User friends</h4>
// //         <div className="rightbarFollowings">
// //           {friends.map((friend) => (
// //             <Link
// //               to={"/profile/" + friend.username}
// //               style={{ textDecoration: "none" }}
// //             >
// //               <div className="rightbarFollowing">
// //                 <img
// //                   src={
// //                     friend.profilePicture
// //                       ? PF + friend.profilePicture
// //                       : PF + "person/noAvatar.png"
// //                   }
// //                   alt=""
// //                   className="rightbarFollowingImg"
// //                 />
// //                 <span className="rightbarFollowingName">{friend.username}</span>
// //               </div>
// //             </Link>
// //           ))}
// //         </div>
// //       </>
// //     );
// //   };
// //   return (
// //     <div className="rightbar">
// //       <div className="rightbarWrapper">
// //         {user ? <ProfileRightbar /> : <HomeRightbar />}
// //       </div>
// //     </div>
// //   );
// // }














