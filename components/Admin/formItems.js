import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Checkbox,
  Upload,
  Space,
  Row,
  Col,
  Dropdown,
  Menu,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { InboxOutlined, UploadOutlined, DownOutlined } from "@ant-design/icons";

export let addTournamentFormItems = [
  <Form.Item name="name" label="Nombre del torneo">
    <Input />
  </Form.Item>,
];

export let addTeamFormItems = [
  <h4>NUEVO EQUIPO</h4>,
  <Form.Item name="badge" label="Escudo" valuePropName="file">
    <Upload name="badge" action="/upload.do" listType="picture">
      <Button icon={<UploadOutlined />}>Click to upload</Button>
    </Upload>
  </Form.Item>,
  <Form.Item name="teamPicture" label="Foto del equipo" valuePropName="file">
    <Upload name="teamPicture" action="/upload.do" listType="picture">
      <Button icon={<UploadOutlined />}>Click to upload</Button>
    </Upload>
  </Form.Item>,
  <Form.Item name="delegatePicture" label="Foto Delegado" valuePropName="file">
    <Upload name="fotoDelegado" action="/upload.do" listType="picture">
      <Button icon={<UploadOutlined />}>Click to upload</Button>
    </Upload>
  </Form.Item>,
  <Form.Item name="name" label="Nombre del equipo">
    <Input />
  </Form.Item>,
  <Form.Item name="players" label="Jugadores">
    <Form.List name="players">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              style={{ display: "flex", marginBottom: 8 }}
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, "name"]}
                rules={[{ required: true, message: "Missing name" }]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              {/*    <Form.Item
                {...restField}
                name={[picture, "picture"]}
                rules={[{ required: true, message: "Missing picture" }]}
              >
                <Upload name="picture" action="/upload.do" listType="picture">
                  <Button icon={<UploadOutlined />}>
                    Click to upload picture
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item
                {...restField}
                name={[captain, "captain"]}
                rules={[{ required: true, message: "Missing captain" }]}
              >
                <Checkbox.Group>
                  <Row>
                    <Col span={8}>
                      <Checkbox
                        value={true}
                        style={{
                          lineHeight: "32px",
                        }}
                      >
                        Captain
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item> */}
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Add Player
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  </Form.Item>,
];
export let addSubTournamentItems = [
  <h4>NUEVO SUBTORNEO</h4>,
  <Form.Item name="name" label="Nombre del SubTorneo">
    <Input />
  </Form.Item>,
  <Form.Item name="isPlayoff" valuePropName="checked">
    <Checkbox>IsPlayoff</Checkbox>
  </Form.Item>,
];
export let addMatchItems = [<h4>NUEVO PARTIDO</h4>];
