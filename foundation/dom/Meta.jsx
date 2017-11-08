import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';


const Meta = (props) => {
  const params = { meta: [...props.meta] };
  const { description, image, title, type } = props;

  if (title) {
    params.title = title;

    if ( ! props.meta.find(meta => meta.name === 'title')) {
      params.meta.push({ name: 'title', content: title });
    }

    if ( ! props.meta.find(meta => meta.property === 'og:title')) {
      params.meta.push({ property: 'og:title', content: title });
    }
  }

  if (description) {
    if ( ! props.meta.find(meta => meta.name === 'description')) {
      params.meta.push({ name: 'description', content: description });
    }

    if ( ! props.meta.find(meta => meta.property === 'og:description')) {
      params.meta.push({ property: 'og:description', content: description });
    }
  }

  if (image) {
    if ( ! props.meta.find(meta => meta.property === 'og:image')) {
      params.meta.push({ property: 'og:image', content: image });
    }

    if ( ! props.meta.find(meta => meta.property === 'twitter:image')) {
      params.meta.push({ property: 'twitter:image', content: image });
    }
  }

  if (type) {
    if ( ! props.meta.find(meta => meta.property === 'og:type')) {
      params.meta.push({ property: 'og:type', content: type });
    }
  }

  return <Helmet { ...params } />;
};

Meta.defaultProps = {
  description: null,
  image: null,
  title: null,
  type: null,
  meta: [],
};

Meta.propTypes = {
  description: PropTypes.string,
  image: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.array,
};

export default Meta;
