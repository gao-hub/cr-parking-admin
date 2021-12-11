import React, { useState, useEffect } from 'react';
import { Col, Row, Select, Button, Input, Icon, Checkbox, message } from 'antd';
import * as _ from 'lodash';
import Upload from '@/components/Upload';
import { connect } from 'dva';
import { _baseApi } from '@/defaultSettings';
import styles from './index.less';

const { Option } = Select;

const Spec = ['规格', '颜色', '尺寸', '款式', '种类', '套餐', '版本', '型号', '容量', '系列'];

let count = 0;

function SpecSelect(props) {
  const { index, specSelectData, dispatch, infoData, disabled } = props;
  const [specValueInput, setSpecValueInput] = useState([]);
  const [showInputDeleIconArr, setShowInputDeleIconArr] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showSpecSelectDicIcon, setshowSpecSelectDicIcon] = useState(false);
  const [specSelectValue, setSpecSelectValue] = useState(undefined);

  const handleonMouseEnterOrLeave = (index1, flag) => {
    setShowInputDeleIconArr(value => {
      const cloneArr = _.cloneDeep(value);
      cloneArr[index1] = flag;
      return cloneArr;
    });
  };

  const handleSelectChange = value => {
    setSpecSelectValue(value);
  };

  const handleCheckboxChange = value => {
    setShowUpload(value.target.checked);
  };

  const addSpecValueInput = ({ InputValue = '', imgFilelist = '' }) => {
    if (specValueInput.length < 20) {
      const pushObj = {
        id: (count += 1),
        value: {
          InputValue,
          imgFilelist,
        },
      };
      setSpecValueInput(value => [...value, pushObj]);
      setShowInputDeleIconArr(value => [...value, false]);
    }
  };

  const handleDelete = index1 => {
    const cloneArr = _.cloneDeep(specSelectData);
    const cloneArr2 = _.cloneDeep(showInputDeleIconArr);

    cloneArr.splice(index1, 1);
    cloneArr2.splice(index1, 1);
    setShowInputDeleIconArr(cloneArr2);
    dispatch({
      type: 'productsManage/setSpecSelectData',
      payload: cloneArr,
    });
  };

  const handleInputBlur = value => {
    const specValueInputRef = _.cloneDeep(specValueInput);
    specValueInputRef.forEach(item => {
      const itemRef = item;
      const valueRef = value;
      if (itemRef.id === value.id) {
        return;
      }
      if (item.value.InputValue === value.value.InputValue) {
        message.error('请不要重复输入规格值');
        valueRef.value.InputValue = '';
      }
    });
    setSpecValueInput([...specValueInputRef]);
  };

  // [
  //   {
  //     "detail": [
  //       {
  //         "image": "home_product_file_1627005643030.jpg",
  //         "name": "红色"
  //       },
  //       {
  //         "image": "home_product_file_1627005645225.jpg",
  //         "name": "褐色"
  //       },
  //       {
  //         "image": "home_product_file_1627005647455.jpg",
  //         "name": "黑色"
  //       },
  //       {
  //         "image": "home_product_file_1627005649850.jpg",
  //         "name": "白色"
  //       },
  //       {
  //         "image": "home_product_file_1627005651951.jpg",
  //         "name": "橙色"
  //       }
  //     ],
  //     "value": "颜色"
  //   },
  //   {
  //     "detail": [
  //       {
  //         "image": "",
  //         "name": "512"
  //       },
  //       {
  //         "image": "",
  //         "name": "64"
  //       },
  //       {
  //         "image": "",
  //         "name": "128"
  //       }
  //     ],
  //     "value": "容量"
  //   }
  // ]

  useEffect(() => {
    if (!specSelectData[index].value.selectValue) {
      // 如果没有数据，则加载初始数据
      if (infoData && infoData.items !== null && infoData.items[index]) {
        setSpecSelectValue(infoData.items[index].value);
        setShowUpload(infoData.items[index].contorFlag === 1);

        infoData.items[index].detail.forEach(item => {
          addSpecValueInput({
            InputValue: item.name,
            imgFilelist: item.image,
          });
        });
      }
    } else {
      // 如果有数据，则加载最新数据
      setSpecSelectValue(specSelectData[index].value.selectValue);
      setShowUpload(specSelectData[index].value.contorFlag === 1);
    }
  }, []);

  useEffect(
    () => {
      // 过滤有效值
      if (specValueInput.length > 0 && specSelectValue && specSelectValue !== '') {
        const cloneArr = [...specSelectData];
        cloneArr[index].value = {
          val: specValueInput,
          selectValue: specSelectValue,
          contorFlag: showUpload ? 1 : 0,
        };
        dispatch({
          type: 'productsManage/setSpecSelectData',
          payload: cloneArr,
        });
        dispatch({
          type: 'productsManage/setIsChanged',
          payload: true,
        });
      }
    },
    [specValueInput, specSelectValue, showUpload]
  );

  useEffect(
    () => {
      if (
        specSelectData[index].value &&
        specSelectData[index].value.val &&
        specSelectData[index].value.val.length > 0
      ) {
        setSpecValueInput(specSelectData[index].value.val);
      }
    },
    [specSelectData]
  );

  return (
    <div
      style={{
        marginBottom: '20px',
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '10px',
      }}
      onMouseEnter={() => {
        setshowSpecSelectDicIcon(true);
      }}
      onMouseLeave={() => {
        setshowSpecSelectDicIcon(false);
      }}
    >
      {showSpecSelectDicIcon &&
        !disabled && (
          <Icon
            type="close-square"
            className={styles.specSelectDicIconwrapper}
            onClick={() => {
              handleDelete(index);
            }}
            style={{
              fontSize: '20px',
            }}
          />
        )}
      <Row gutter={24}>
        <Col span={4}>规则名</Col>
        <Col span={20}>
          <Select
            placeholder="请选择"
            style={{ width: 120 }}
            onChange={handleSelectChange}
            defaultValue={
              infoData && infoData.items && infoData.items[index] && infoData.items[index].value
            }
            value={specSelectValue}
            disabled={disabled}
          >
            {Spec.map(item => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </Select>
          {index === 0 ? (
            <Checkbox onChange={handleCheckboxChange} checked={showUpload} disabled={disabled}>
              添加规格图片
            </Checkbox>
          ) : null}
        </Col>
        <Col span={4}>规则值</Col>
        <Col span={20} className={styles.valueAndBtnwrapper}>
          {specValueInput.map((item, index1) => {
            const itemObj = item;
            return (
              <div
                className={styles.inputwrapper}
                key={itemObj.id}
                onMouseEnter={() => {
                  handleonMouseEnterOrLeave(index1, true);
                }}
                onMouseLeave={() => {
                  handleonMouseEnterOrLeave(index1, false);
                }}
              >
                {showInputDeleIconArr[index1] && !disabled ? (
                  <Icon
                    type="close-square"
                    className={styles.inputIconwrapper}
                    onClick={() => {
                      setSpecValueInput(items1 => items1.filter(item1 => item1.id !== itemObj.id));
                    }}
                  />
                ) : null}
                <Input
                  defaultValue={itemObj.value.InputValue}
                  value={itemObj.value.InputValue}
                  onChange={e => {
                    itemObj.value.InputValue = e.target.value;
                    setSpecValueInput([...specValueInput]);
                  }}
                  onFocus={() => {
                    handleonMouseEnterOrLeave(index1, true);
                  }}
                  onBlur={() => {
                    handleInputBlur(itemObj);
                  }}
                  maxLength={20}
                  disabled={disabled}
                />
                {showUpload ? (
                  <Upload
                    defaultUrl={itemObj.value.imgFilelist}
                    uploadConfig={{
                      action: `${_baseApi}/homeStoreProduct/upload`,
                      fileType: ['image'],
                      size: 1,
                    }}
                    setIconUrl={url => {
                      itemObj.value.imgFilelist = url;
                    }}
                    disabled={disabled}
                  />
                ) : null}
              </div>
            );
          })}
          <Button
            type="primary"
            style={{ width: 120 }}
            onClick={() => {
              addSpecValueInput(showUpload);
            }}
            disabled={specValueInput.length >= 20 || disabled}
          >
            添加
          </Button>
        </Col>
      </Row>
    </div>
  );
}

const mapStatetoprops = ({ productsManage }) => ({
  specSelectData: productsManage.specSelectData,
  infoData: productsManage.infoData,
});

export default connect(mapStatetoprops)(SpecSelect);
