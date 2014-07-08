//系统的模块结构
var structure = [
    {
        text: '个人空间',
        id: 2,
        route: '/person',
        sub: [{
                text: '首页',
                id: 21,
                route: '/person',
                sub: []
            }
        ]
    },
    {
        text: '系统管理',
        id: 1,
        route: '/user',
        sub: [
            {
                text: '用户与权限',
                id: 11,
                route: '',
                sub: [
                    {
                        text: '用户管理',
                        id: 111,
                        route: '/user',
                        sub: [
                            {
                                id: 1111,
                                text: '删除',
                                route: '/userDelete'
                            }, {
                                id: 1112,
                                text: '编辑账号',
                                route: '/userEdit'
                            }]
                    },
                    {
                        text: '创建用户',
                        id: 114,
                        route: '/userAdd'
                    },
                    {
                        text: '权限管理',
                        id: 112,
                        route: '/role',
                        sub: [
                            {
                                text: '权限编辑',
                                id: 1121,
                                route: '/roleEdit'

                            },
                            {
                                text: '权限删除',
                                id: 1122,
                                route: '/roleDelete'

                            }
                        ]
                    },
                    {
                        text: '创建权限',
                        id: 115,
                        route: '/roleAdd'
                    },
                    {
                        text: '部门管理',
                        id: 113,
                        route: '/department',
                        sub: [
                            {
                                text: '部门编辑',
                                id: 1131,
                                route: '/departmentSave'
                            }
                        ]

                    }
                ]
            },
            {
                text: '服务器管理',
                id: 116,
                route: '',
                sub: []
            }
        ]
    },
    {
        text: '账号管理',
        id: 3,
        route: '/sinasearch',
        sub: [
            {
                text: '新浪账号',
                id: 31,
                route: '',
                sub: [
                    {
                        text: '账号查询',
                        id: 311,
                        route: '/sinasearch'
                    },
                    {
                        text: '账号导入',
                        id: 312,
                        route: '/sinaloadin'
                    }
                ]
            }
        ]
    },
    {
        text: '引导系统',
        id: 4,
        route: '/newscommmit',
        sub: [
            {
                text: '新闻引导',
                id: 41,
                route: '/newscommmit',
                sub: [
                    {
                        text: '新闻评论',
                        id: 411,
                        route: '/newscommmit',
                        sub: [
                            {
                                id: 4111,
                                text: '详情',
                                route: '/newscommmitdetail'
                            }, {
                                id: 4112,
                                text: '删除',
                                route: '/newscommmitdetele'
                            }, {
                                id: 4113,
                                text: '停止',
                                route: '/newscommmitstop'
                            }, {
                                id: 4114,
                                text: 'start',
                                route: '/newscommmitstart'
                            }, {
                                id: 4115,
                                text: '新建',
                                route: '/newscommmitNew'
                            }
                        ]

                    },
                    {
                        text: '新闻支持',
                        id: 412,
                        route: '/newssupport',
                        sub: [
                            {
                                id: 4121,
                                text: '详情',
                                route: '/newssupportdetail'
                            }, {
                                id: 4122,
                                text: '删除',
                                route: '/newssupportdetele'
                            }, {
                                id: 4123,
                                text: 'stop',
                                route: '/newssupportstop'
                            }, {
                                id: 4124,
                                text: 'start',
                                route: '/newssupportstart'
                            }
                        ]

                    }, {
                        text: '新建支持任务',
                        id: 413,
                        route: '/newssupportNew'
                    }

                ]
            }
        ]

    },
    {
        text: '调度系统',
        id: 5,
        route: '/scheduleClient',
        sub: [
            {
                text: '执行端',
                id: 51,
                route: '/scheduleClient',
                sub: [
                    {
                        text: '在线执行端',
                        id: 511,
                        route: '/scheduleClient'

                    }
                ]
            }
        ]
    },
    {
        text: '长河监控',
        id: 6,
        route: '/lrstatus',
        sub: [
            {
                text: '系统状态',
                id: 61,
                route: '/lrstatus'

            },
            {
                text: '新浪账号状态',
                id: 62,
                route: '/lrsinaAccount',
                sub: [
                    {
                        text: '账号分布',
                        id: 621,
                        route: '/lrsinaAccount'

                    },
                    {
                        text: '24小时账号变化',
                        id: 622,
                        route: '/lrsinaAccount24'

                    }
                ]
            },
            {
                text: '任务统计',
                id: 63,
                route: '/lrmiss',
                sub: [
                    {
                        text: '任务执行分布',
                        id: 631,
                        route: '/lrmiss'

                    },
                    {
                        text: '30天任务统计',
                        id: 632,
                        route: '/lrmiss30'

                    },
                    {
                        text: '7天任务执行量',
                        id: 633,
                        route: '/lrmiss7'

                    },
                    {
                        text: '单个任务执行情况',
                        id: 634,
                        route: '/lrmissOne'

                    }
                ]
            },
            {
                text: '日志查询',
                id: 64,
                route: '/lrlog'

            }
        ]
    }
];

module.exports = structure;