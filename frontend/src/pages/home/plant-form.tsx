import { Button, Col, Input, Row, Select, Slider, Space, Typography } from 'antd';
import { IPlant } from './types';

const fullWidth = { width: '100%' };

interface PlantFormProps {
    plant: IPlant;
    onChange: (field: keyof IPlant, value: string | number) => void;
    onSubmit: () => void;
    onCancel: () => void;
    loading?: boolean;
    isEditing?: boolean;
}

const PlantForm = ({ plant, onChange, onSubmit, onCancel, loading, isEditing }: PlantFormProps) => {
    return (
        <Space direction='vertical' style={fullWidth}>
            <Typography.Title level={5}>Basic Information</Typography.Title>
            <Row gutter={[16, 16]} style={fullWidth}>
                <Col span={24} md={12}>
                    <label>Plant Name</label>
                    <Input value={plant.name} name='name' onChange={e => onChange('name', e.target.value)} />
                </Col>

                <Col span={24} md={12}>
                    <label>Plant Type</label>
                    <Select
                        style={fullWidth}
                        allowClear
                        value={plant.type}
                        onChange={val => onChange('type', val)}
                        placeholder='Select a type'
                        options={[
                            { value: 'indoor', label: 'Indoor' },
                            { value: 'outdoor', label: 'Outdoor' },
                            { value: 'vegatable', label: 'Vegetable' },
                            { value: 'herb', label: 'Herb' },
                            { value: 'tropical', label: 'Tropical' }
                        ]}
                    />
                </Col>

                <Col span={24} md={12}>
                    <label>Weekly Water Need (ml)</label>
                    <Input
                        value={plant.weeklyWaterNeed}
                        name='weeklyWaterNeed'
                        onChange={e => onChange('weeklyWaterNeed', e.target.value)}
                    />
                </Col>

                <Col span={24} md={12}>
                    <label>Expected Humidity</label>
                    <Slider value={plant.expectedHumidity} onChange={val => onChange('expectedHumidity', val)} />
                </Col>
            </Row>

            <Space>
                <Button onClick={onCancel}>Cancel</Button>
                <Button loading={loading} type='primary' onClick={onSubmit}>
                    {isEditing ? 'Update' : 'Add'} Plant
                </Button>
            </Space>
        </Space>
    );
};

export default PlantForm;
