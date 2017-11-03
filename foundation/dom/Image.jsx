import PropTypes from 'prop-types';
import React from 'react';


const Image = (props) => {
  const images = [];

  const process = (image) => {
    if (typeof (image) !== 'object') {
      return image;
    }

    let src = null;

    if (props.base) {
      let { base } = props;

      if (image.size) {
        if (image.size.width) {
          base = `${ base }/${ image.size.density ? image.size.width * image.size.density : image.width }`;
        }

        if (image.size.height) {
          base = `${ base }x${ image.size.density ? image.size.height * image.size.density : image.height }`;
        }
      }

      src = `${ base }/${ image.src }`;
    }

    if (image.descriptor) {
      src = `${ src } ${ image.descriptor }`;
    }

    return src;
  };

  if (Array.isArray(props.src)) {
    props.src.map(src => images.push(process(src)));
  } else {
    images.push(process(props.src));
  }

  return <img { ...props } alt={ props.alt } srcSet={ images.join(',') } />;
};

Image.defaultProps = {
  base: null,
};

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  base: PropTypes.string,
  src: PropTypes.oneOfType([
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        src: PropTypes.string.isRequired,
        descriptor: PropTypes.string,
        size: PropTypes.shape({
          width: PropTypes.number,
          height: PropTypes.number,
          density: PropTypes.number,
        }),
      }),
    ]),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        src: PropTypes.string.isRequired,
        size: PropTypes.shape({
          width: PropTypes.number,
          height: PropTypes.number,
          ratio: PropTypes.number,
        }),
      }),
    ])),
  ]).isRequired,
};
