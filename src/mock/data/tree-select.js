export const treeData = [
  {
    id: 1,
    title: '1',
    children: [
      {
        id: 11,
        title: '1-1',
        loading: false,
        children: [
          // {
          //   id: 111,
          //   title: '1-1-1'
          // },
          // {
          //   id: 112,
          //   title: '1-1-2'
          // },
          // {
          //   id: 113,
          //   title: '1-1-3'
          // },
          // {
          //   id: 114,
          //   title: '1-1-4'
          // }
        ]
      },
      {
        id: 12,
        title: '1-2',
        children: [
          {
            id: 121,
            title: '1-2-1'
          }
        ]
      }
    ]
  }
]

export const newTreeData = [
  {
    id: 'a',
    title: 'a',
    children: [
      {
        id: 'a1',
        title: 'a-1',
        children: [
          {
            id: 112,
            title: '1-1-2'
          },
          {
            id: 'a12',
            title: 'a-1-2'
          },
          {
            id: 'a13',
            title: 'a-1-3'
          },
          {
            id: 'a14',
            title: 'a-1-4'
          }
        ]
      },
      {
        id: 'a2',
        title: 'a-2',
        children: [
          {
            id: 'a21',
            title: 'b-2-1'
          }
        ]
      }
    ]
  }
]

export const menuTreeData = [
  {
    id: 'a',
    title: 'a',
    children: [
      {
        id: 'a1',
        title: 'a-1',
        children: [
          {
            id: 112,
            title: '1-1-2'
          },
          {
            id: 'a12',
            title: 'a-1-2'
          },
          {
            id: 'a13',
            title: 'a-1-3'
          },
          {
            id: 'a14',
            title: 'a-1-4'
          }
        ]
      },
      {
        id: 'a2',
        title: 'a-2',
        children: [
          {
            id: 'a21',
            title: 'b-2-1'
          }
        ]
      }
    ]
  }
]
export const userFindTypeData = {
  message: '请求成功',
  status: 200,
  "data":{
    "pageNum": 1,
    "pageSize": 10,
    "totalSize": 8,
    "totalPages": 1,
    "content":[
      {"userId": 3, "userName": "huasheng", "userType": "2", "adminFlag": "1"},
      {"userId": 4, "userName": "wangAdmin", "userType": "2", "adminFlag": "0"},
      {"userId": 6, "userName": "caizong", "userType": "2", "adminFlag": "0"},
      {"userId": 10, "userName": "blxx", "userType": "2", "adminFlag": "1"},
      {"userId": 11, "userName": "haide", "userType": "2", "adminFlag": "1"},
      {"userId": 12, "userName": "shenAdmin", "userType": "2", "adminFlag": "0"},
      {"userId": 13, "userName": "bosiny", "userType": "2", "adminFlag": "1"},
      {"userId": 14, "userName": "shenAdmin1", "userType": "2", "adminFlag": "0"}
    ]
  }
}
