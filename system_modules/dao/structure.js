//系统的模块结构
var structure = [
    {
        name: '个人空间',
        id: 2,
        route: '/person',
        sub: [{
                name: '首页',
                id: 21,
                route: '/person',
                sub: []
            }
        ]
    },
    {
        name: '系统管理',
        id: 1,
        route: '/user',
        sub: [
            {
                name: '用户与权限',
                id: 11,
                route: '',
                sub: [
                    {
                        name: '用户管理',
                        id: 111,
                        route: '/user',
                        add:{
                            name:'添加',
                            route:'/useradd'
                        },
                        remove:{
                            name:'删除',
                            route:'/userDelete'
                        },
                        edit:{
                            name:'编辑',
                            route:'/userEdit'
                        }
                        
                    },
                    {
                        name: '用户权限',
                        id: 112,
                        route: '/role'
                    },
                    {
                        name: '部门管理',
                        id: 113,
                        route: '/department'
                    }
                ]
            },
            {
                name: '服务器管理',
                id: 112,
                route: '',
                sub: []
            }
        ]
    },
    {
       name: '账号管理',
        id: 3,
        route: '/user',
        sub: [
            {
                name: '新浪账号',
                id: 31,
                route: '',
                sub: [
                    {
                        
                    }
                ]
            }
        ]
    }
];

module.exports = structure;