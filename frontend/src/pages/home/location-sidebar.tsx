import { Typography, Button, Space } from 'antd';
import { Location } from 'store';
import styles from './home.module.scss';

interface Props {
    locations: Location[];
    selectedPlaceId: string;
    onSelect: (loc: Location) => void;
    onAdd: () => void;
}

const LocationSidebar = ({ locations, onSelect, onAdd }: Props) => (
    <div className={styles.sidebar}>
        <Typography>Locations</Typography>
        <Space direction='vertical'>
            {locations.map(loc => (
                <Typography key={loc._id} className={styles.location} onClick={() => onSelect(loc)}>
                    {loc.name}
                </Typography>
            ))}
            <Button type='primary' onClick={onAdd}>
                Add Location
            </Button>
        </Space>
    </div>
);

export default LocationSidebar;
