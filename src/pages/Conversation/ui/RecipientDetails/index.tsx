import { OutletDetailsButton } from '@/shared/ui/OutletDetailsButton';
import { OutletDetailsTypes } from '@/shared/model/types';
import { Recipient } from '../../model/types';

export const RecipientDetails = ({ recipient }: { recipient: Recipient }) => (
    <div className='flex flex-col'>
        {recipient.status && <OutletDetailsButton data={recipient.status} type={OutletDetailsTypes.BIO} />}
        <OutletDetailsButton data={recipient.login} type={OutletDetailsTypes.LOGIN} />
        <OutletDetailsButton data={recipient.email} type={OutletDetailsTypes.EMAIL} />
    </div>
);