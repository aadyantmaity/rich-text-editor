import { FC } from 'react';
import RichEditor from './components/rich-editor';

interface Props {}

const Home: FC<Props> = () => {
  return (
  <div className="max-w-3xl mx-auto p-4">
    <RichEditor/>
  </div>);
};

export default Home;