//系统的模块结构
var structure = [
    {
        name: '个人空间',
        id: 2,
        route: '',
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
        route: '/system',
        sub: [
            {
                name: '用户与权限',
                id: 11,
                route: '',
                sub: [
                    {
                        name: '用户管理',
                        id: 111,
                        route: '/user'
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
            }
        ]
    }
];

module.exports = structure;