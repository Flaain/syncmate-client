import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Typography } from '@/shared/ui/Typography';
import { Link } from 'react-router-dom';
import { Image } from '@/shared/ui/Image';
import { AdsFeed } from '../../model/types';

export const AdsItem = ({ adsItem: { link, description, name, avatar } }: { adsItem: AdsFeed }) => {
    return (
        <li>
            <Link
                target='_blank'
                className='flex items-center gap-5 p-2 rounded-lg transition-colors duration-200 ease-in-out dark:hover:bg-primary-dark-50/30 hover:bg-primary-gray/5'
                to={link}
            >
                <Image
                    src={avatar?.url}
                    skeleton={<AvatarByName name={name} size='lg' />}
                    className='object-cover object-center min-w-[50px] max-w-[50px] h-[50px] rounded-full'
                />
                <div className='flex flex-col items-start w-full'>
                    <Typography as='h2' weight='medium'>
                        {name}
                    </Typography>
                    <Typography as='p' variant='secondary' className='line-clamp-1'>
                        {description}
                    </Typography>
                </div>
            </Link>
        </li>
    );
};