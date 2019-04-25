import React from "react";
import {
  withStyles,
  createStyles,
  Theme,
  WithStyles,
  ListItem,
  ListItemText,
  List,
  ListItemSecondaryAction
} from "@material-ui/core";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { Room } from "../../models";
import { ThumbUp, ThumbDown } from "@material-ui/icons";
import CustomButton from "../common/CustomButton";
import config from "../../config";
import socket, { mainPage } from "../../socket";
import axios from "axios";
import axiosConfig from "../../config/axios";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      flexGrow: 1
    },
    list: {}
  });

interface IProps extends WithStyles<typeof styles> {
  match: any;
  location: any;
  history: any;
  classes: any;
  isLoggedIn: boolean;
  setRooms: (rooms: Array<Room>) => void;
  rooms: Array<Room>;
  fetchRooms: (skip: number, limit: number) => void;
  fetchRoomTotal: () => void;
  setRoomTotal: (total: number) => void;
  total: number;
}

class MainPage extends React.Component<IProps> {
  private socket: any = null;

  public constructor(props) {
    super(props);

    this.socket = socket(mainPage, (err: Error) => {
      alert(
        "서버 에러가 발생했습니다. F5를 눌러 새로고침 해주세요. 에러메시지:" +
          err
      );
    });
  }

  public componentDidMount() {
    this.props.fetchRooms(0, 30);
    this.props.fetchRoomTotal();
    this.initSocket();
  }

  public componentWillUnmount() {
    this.exitSocket();
  }

  initSocket = () => {
    this.socket.emit("join", {});
    this.socket.on("message", roomId => {
      console.log(`소켓 message 값 받음:`, JSON.stringify(roomId));
      this.getARoom(roomId);
    });
  };

  exitSocket = () => {
    this.socket.emit("leave", {});
    this.socket.close();
    console.log(`소켓 해제됨`);
  };

  getARoom = roomId => {
    // 소켓에서 roomId가 잘 전달 됬는지 확인
    if (!roomId) {
      console.log("roomId가 undefined 값이 들어옴 ", roomId);
      return;
    }

    return axios
      .get(
        `${config.REACT_APP_SERVER_URL}/api/rooms?roomId=${roomId}`,
        axiosConfig
      )
      .then(res => {
        if (!res.data) return;

        const room = res.data.message;
        this.props.setRooms([room[0], ...this.props.rooms] as Array<Room>);
        this.props.setRoomTotal(this.props.total + 1);
      })
      .catch(err => {
        // 방 못 가져온 것 예외처리
        console.log(err);
        if (!err.response) return;
      });
  };

  // 클릭시 방안으로 리다이렉트
  handleListItemClick = (roomId: number) => () => {
    this.socket.emit("joinChannal", {roomId});
    this.props.history.push(`/room/${roomId}`);
  };

  // 클릭시 방 만들기 페이지로 리다이렉트
  handleCreateRoomClick = () => {
    if (this.props.isLoggedIn) {
      this.props.history.push(`/create/room`);
      
    } else {
      alert(`로그인을 먼저 해주세요!`);
    }
  };

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CustomButton
          onClick={this.handleCreateRoomClick}
          formattedMessageId="mainpage_btn"
        />
        <List>
          {this.props.rooms.map((room, index) => (
            <ListItem
              alignItems="flex-start"
              key={index}
              button
              role={undefined}
              onClick={this.handleListItemClick(room.id)}
            >
              <ListItemText primary={room.title} />
              <ListItemSecondaryAction>
                <ThumbUp fontSize="small" />
                <span>{room.like}</span>
                <ThumbDown fontSize="small" />
                <span>{room.dislike}</span>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

(MainPage as React.ComponentClass<IProps>).propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
} as any;

export default withStyles(styles)(withRouter(MainPage));
