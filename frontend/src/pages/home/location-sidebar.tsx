import { Typography, Button, Space } from 'antd';
import { Location } from 'store';
import styles from './home.module.scss';

interface Props {
    locations: Location[];
    selectedPlaceId: string;
    onSelect: (loc: Location) => void;
    onAdd: () => void;
}

const LocationSidebar = ({ locations, onSelect, onAdd, selectedPlaceId }: Props) => (
    <div className={styles.sidebar}>
        <Typography style={{ marginBottom: 16, fontSize: '1rem' }}>Locations</Typography>
        <Space direction='vertical'>
            {locations.map(loc => (
                <Typography
                    key={loc._id}
                    style={selectedPlaceId === loc._id ? { color: '#00f' } : { cursor: 'pointer' }}
                    onClick={() => onSelect(loc)}
                >
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
