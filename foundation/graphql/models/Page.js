import mongoose from 'mongoose';

import LocaleAwareField from '../../i18n/models/LocaleAwareField';


const schema = mongoose.Schema({
  uri: { type: String, unique: true },
  name: LocaleAwareField,
  meta: {
    title: LocaleAwareField,
    description: LocaleAwareField,
    keyword: LocaleAwareField,
    image: String,
    type: String,
  },
  related: [
    {
      type: {
        type: String,
      },
      item: mongoose.Schema.Types.ObjectId,
    },
  ],
  information: [
    {
      key: String,
      value: LocaleAwareField,
    },
  ],
  custom: {
    script: String,
    stylesheet: String,
  },
  parent: mongoose.Schema.Types.ObjectId,
});

export default mongoose.model('Page', schema);
