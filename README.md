



## Build Setup
``` bash
npm install
npm start
npm run build
```



### (一) api url请求接口地址存放：
  按照services中 api.js和user.js文件格式存放和获取。

### (二) 全局loading：
  发起请求会自动设置`loading`为`true`,请求完毕改为`false`

### (三) fetch  网络请求 引入utils中request.js：

  get（post）方式:
  ``` javascript
  export async function fakeSubmitForm(params) {
    return request('/api/forms', {
      method: 'POST',
      body: params,
    });
  }
  ```

### (四) 代码规范

1. 业务代码一般放到src/routes文件夹里面

2. 纯组件一般放到src/components文件夹里面

3. http请求放在src/services文件夹

4. html/js模块统一加注释，js中添加注释方法用 `{/*  */}`,css要用`//`

  js里面的每个方法要加注释`{/*  */}`

5. 变量命名：js里面的临时变量都用驼峰式，比如`userId`

  css里面的class命名都用驼峰式，比如`userId`

6. 函数前面要加空行，关键字之间的前后要加空格

7. models、service中的命名规则用小驼峰写法，组件的命名规则用大驼峰写法

### (五) 生命周期
##### 实例化
1. getDefaultProps

  作用于组件类，只调用一次，返回对象用于设置默认的`props`，对于引用值，会在实例中共享。

  ``` javascript
    static defaultProps = {}
  ```
2. getInitialState

  作用于组件的实例，在实例创建时调用一次，用于初始化每个实例的`state`，此时可以访问`this.props`。

  可以直接在构造函数`constructor`中直接设置 `this.state={}`

3. componentWillMount

  在完成(首次)渲染之前调用，此时仍可以修改组件的`state`。

4. render

  必选的方法，创建虚拟DOM，该方法具有特殊的规则：

  1. 只能通过`this.props`和`this.state`访问数据

  2. 可以返回`null、false`或任何React组件

  3. 只能出现一个顶级组件（不能返回数组）

  4. 不能改变组件的状态

  5. (不能修改DOM)的输出

5. componentDidMount

  真实的DOM被渲染出来后调用，在该方法中可通过`this.getDOMNode()`访问到真实的DOM元素。此时已可以使用其他类库来操作这个DOM。

  在服务端中，该方法不会被调用。

##### 存在期
 6. componentWillReceiveProps

  组件接收到新的`props`时调用，并将其作为参数`nextProps`使用，此时可以更改组件`props`及`state`。
  ``` javascript
    componentWillReceiveProps: (nextProps) => {
        if (nextProps.bool) {
            this.setState({
                bool: true
            });
        }
    }
  ```

7. shouldComponentUpdate

  组件是否应当渲染新的`props`或`state`，返回`false`表示跳过后续的生命周期方法，通常不需要使用以避免出现bug。在出现应用的瓶颈时，可通过该方法进行适当的优化。

  在首次渲染期间或者调用了`forceUpdate`方法后，该方法不会被调用

8. componentWillUpdate

  接收到新的`props`或者`state`后，进行渲染之前调用，此时不允许更新`props`或`state`。

9. componentDidUpdate

  完成渲染新的`props`或者`state`后调用，此时可以访问到新的DOM元素。

##### 销毁期

  10. componentWillUnmount

  组件被移除之前被调用，可以用于做一些清理工作，在`componentDidMount`方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器。

### (六) 页面跳转

  注意：

##### （一）页面跳转不要用 `href` 形式跳转，可以使用dva/router中的 `<Link>` 创建 a 标签跳转 或是 dva/router中`routerRedux`，如下：

  1. 编程式：

  ``` javascript
   dispatch(routerRedux.push('/membercenter/test/details'))
  ```
  2. 声明式：
  ``` html
  <Link to="/"></Link>
  ```

##### （二）路由传参

1. 编程式：

    ``` javascript
    hashHistory.push({  
        pathname: '/apartmentReserve/'+yourApartmentId,  
        query: {  
            name:yourApartmentname,  
            price:yourApartmentprice  
        },  
    })
    ```

2. 声明式：

    ``` html
    <Link to={{
         pathname:"/jump",   
         hash:'#ahash',    
         query:{foo: 'foo', boo:'boo'},    
         state:{data:'hello'}     
     } } >点击跳转 </Link>
    ```

### (八) 组件的调用

 1.  通过`import`关键字引入组件

 2.  在父组件的`render`函数中写入组件名称标签，根据组件需求传入相应属性

### (九) 全局状态/方法的调用(redux-saga)

##### (一) 定义model

  在src/models文件夹下，可以创建一个模块，里面包含了全局状态、修改状态的方法等。

##### (二) 定义model下的初始状态

  model下`state`字段中可以定义该model下的初始状态

##### (三) 定义model下的reducer

  `reducer`是改变model中的`state`的唯一途径，通过调用`reducer`并传入相应参数，从而改变`state`中变量的值，
  其`return`的值为新的`state`的值

##### (四) 定义model下的effects

  与redux（Vuex）不同，redux-saga在Redux应用中扮演’中间件’的角色，主要用来执行数据流中的异步操作。

  主要通过ES6中的`generator`函数和`yield`关键字来以同步的方式实现异步操作。

  redux-saga中有几个API函数

  1. takeEvery

    用来监听action，每个action都触发一次，如果其对应是异步操作的话，每次都发起异步请求，而不论上次的请求是否返回。
  2. takeLatest

      作用同`takeEvery`一样，唯一的区别是它只关注最后，也就是最近一次发起的异步请求，如果上次请求还未返回，则会被取消。
  3. call

    `call`用来调用异步函数，将异步函数和函数参数作为`call`函数的参数传入，返回一个js对象。`saga`引入他的主要作用是方便测试，
    同时也能让我们的代码更加规范化。在本项目中，主要运用`call`函数进行数据请求。
  4. put

   `put`是 saga 对 Redux 中`dispatch`方法的一个封装，调用`put`方法后，`saga`内部会分发`action`通知`Store`更新`state`。

##### (五) 在组件中获取状态/调用方法

  1. 在src/common/router下的路由定义时，写出此页面需要调用的model名称:
    ``` javascript
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    }
    ```
  2. 在相应的页面中，引入`connect`函数:
    ``` javascript
    import { connect } from 'dva'
    ```

  3. 通过装饰器函数`@`关键字，引入相应model:
    ``` javascript
    @connect(({modelName}) => {
      modelName
    })
    ```
  4. 而后则可以在该组件中通过`this.props`上挂载的变量取到model中`state`的值

  5. 如需调用model中的`effects`方法，则通过`this.props`上的`dispatch`方法进行状态值的改变:
    ``` javascript
    this.props.dispatch({
      type: 'modelName/effectsName',
      payload: argsName,
    });
    ```
