import { FC } from 'react';
import { BiCheck, BiSolidTrash } from 'react-icons/bi';

interface Props {
    src: string
    onDeleteClick?(): void
    onSelectClick?(): void
}

const GalleryImage: FC<Props> = ({src, onDeleteClick, onSelectClick}) => {
    return (
        <div className="group relative w-full aspect-square overflow-hidden rounded">
            <img 
              src={src}
              alt="Flowers"
              className="w-full h-full object-cover"
            />

            <div className="hidden absolute group-hover:flex bottom-0 left-0 right-0">
                <button onClick={onSelectClick} className="bg-green-400 text-white flex-1 flex items-center justify-center p-2">
                    <BiCheck/>
                </button>
            </div>
        </div> 
    );
};

export default GalleryImage;



