import styled from 'styled-components';

export const imageStyles = theme => ({
  root: {
    marginTop: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3, 2),
  },
  imageProgress: {
    position: 'absolute',
    color: theme.palette.common.white,
    top: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    right: 0,
  },
  removeImageBtn: {
    position: 'absolute',
    color: theme.palette.common.white,
    top: 0,
    right: 0,
    padding: theme.spacing(0.5),
    zIndex: 5,
    display: 'none',
  },
  fileUploadRoot: {
    display: 'inline-flex',
  },
});

export const fileStyles = () => ({
  root: {
    display: 'inline-block',
  },
});

export const StyledUploadImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  transition: .5s ease;
  backface-visibility: hidden;
  filter: ${props => props.uploading ? 'brightness(70%)' : 'none'};
  box-shadow: ${props => props.error ? '0px 0px 3px 2px red' : 'none'};
`;

export const StyledImageWrapper = styled.div`
  position: relative;
  width: 150px;
  
  :hover {
    .MuiIconButton-root {
      display: block;
    }

    > img {
      filter: brightness(70%);
    }
  }
`;
