import {
  SET_CREATEROOM_DESC,
  SET_CREATEROOM_TITLE,
  SET_CREATEROOM_WRITERLIMIT,
  SET_CREATEROOM_GENRE,
  SET_CREATEROOM_COVERIMAGE,
  SET_CREATEROOM_TAGS,
  ICreateRoomAction,
  INIT_CREATEROOM_STATE,
  SET_CREATEROOM_GENRE_ERROR,
  SET_CREATEROOM_TITLE_ERROR
} from "../actions";

export interface ICreateRoomState {
  writerLimit: string;
  title: string;
  desc: string;
  genre: string;
  tags: string;
  coverImage: string;
  isTitleError: boolean;
  isGenreError: boolean;
}

const createEmpty = () => ({
  writerLimit: "100",
  title: "",
  desc: "",
  genre: "",
  tags: "",
  coverImage: "",
  isTitleError: false,
  isGenreError: false
} as ICreateRoomState);

export const createRoomReducer = (
  state = createEmpty(),
  action: ICreateRoomAction
) => {
  switch (action.type) {
    case SET_CREATEROOM_GENRE_ERROR: {
      return {
        ...state,
        isGenreError: action.isGenreError
      } as ICreateRoomState;
    }
    case SET_CREATEROOM_TITLE_ERROR: {
      return {
        ...state,
        isTitleError: action.isTitleError
      } as ICreateRoomState;
    }
    case SET_CREATEROOM_DESC: {
      return {
        ...state,
        desc: action.desc
      } as ICreateRoomState;
    }
    case SET_CREATEROOM_TITLE: {
      return {
        ...state,
        title: action.title,
        isTitleError: isPassedTitleForm(action.title)
      } as ICreateRoomState;
    }
    case SET_CREATEROOM_WRITERLIMIT: {
      return {
        ...state,
        writerLimit: action.writerLimit
      } as ICreateRoomState;
    }

    case SET_CREATEROOM_TAGS: {
      return {
        ...state,
        tags: action.tags
      } as ICreateRoomState;
    }

    case SET_CREATEROOM_GENRE: {
      return {
        ...state,
        genre: action.genre,
        isGenreError: isPassedGenreForm(action.genre)
      } as ICreateRoomState;
    }

    case SET_CREATEROOM_COVERIMAGE: {
      return {
        ...state,
        coverImage: action.coverImage
      } as ICreateRoomState;
    }
    case INIT_CREATEROOM_STATE: {
      return createEmpty();
    }
    default:
      return state;
  }
};

const isPassedTitleForm = (title: string) => {
  if (title.length <= 0) return false; 
  if (title.length >= 0 && title.length <= 100) return false;
  return true;
} 

const isPassedGenreForm = (genre: string) => {
  if (genre.length > 0) return false;
  return true;
}