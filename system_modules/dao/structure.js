//系统的模块结构
var structure = [
    //个人信息
    {
        text: '个人空间',
        id: 2,
        route: '/person',
        sub: [{
                text: '首页',
                id: 21,
                route: '/person',
                sub: [
                    {
                        text: '个人信息',
                        id: 211,
                        route: '/personinfo'
                    },
                    {
                        text: '修改密码',
                        id: 212,
                        route: '/changepassword'
                    }
                ]
            },
            {
                text: '信息',
                id: 22,
                route: '/messageBox',
                sub: [
                    {
                        text: '系统信息',
                        id: 211,
                        route: '/systemMessage'
                    }
                ]
            }


        ]
    },
    //系统管理
    {
        text: '系统管理',
        id: 1,
        route: '/user',
        sub: [
            {
                text: '用户管理',
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
                            }
                            , {
                                id: 1113,
                                text: '密码重置',
                                route: '/passwordReset'
                            }]
                    },
                    {
                        text: '创建用户',
                        id: 114,
                        route: '/userAdd'
                    }


                ]
            },
            {
                text: '权限管理',
                id: 12,
                route: '',
                sub: [
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
                    }
                ]
            },
            {
                text: '部门管理',
                id: 13,
                route: '',
                sub: [
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
                text: '基本设置',
                id: 14,
                route: '/homeset',
                sub: [
                    {
                        text: '首页设置',
                        id: 141,
                        route: '/homeset'

                    },
                    {
                        text: '显示设置',
                        id: 142,
                        route: '/displaySet'

                    }
                ]
            }

        ]
    },
    //引导系统
    {
        text: '引导系统',
        id: 4,
        route: 'mytask',
        sub: [
            //任务管理
            {
                text: '任务管理',
                id: 40,
                route: '',
                sub: [
                    {
                        text: '我的任务',
                        id: 401,
                        route: '/mytask',
                        sub: [
                            {
                                text: '任务信息',
                                id: 4011,
                                route: '/taskInfo'
                            }, {
                                id: 4012,
                                text: '停止',
                                route: '/taskstop'
                            }, {
                                id: 4013,
                                text: '开始',
                                route: '/taskstart'
                            }, {
                                id: 4014,
                                text: '放弃',
                                route: '/taskcancel'
                            }
                        ]
                    },
                    {
                        text: '新建任务',
                        id: 402,
                        route: '/newtask',
                        sub: [
                            {
                                text: '新闻评论',
                                id: 4021,
                                route: '/newsCommentNew',
                                sub: [
                                    {
                                        text: '网易新闻评论',
                                        id: 40211,
                                        icons: '16348.png',
                                        route: '/t303'
                                    },
                                    {
                                        text: '新浪新闻评论',
                                        id: 40212,
                                        icons: 'sina48.png',
                                        route: '/t206'
                                    },
                                    {
                                        text: '搜狐新闻评论',
                                        id: 40213,
                                        icons: 'sohu48.png',
                                        route: '/t403'
                                    },
                                    {
                                        text: '凤凰新闻评论',
                                        id: 40214,
                                        icons: 'ifeng48.png',
                                        route: '/t501'
                                    }
                                ]
                            },
                            {
                                text: '新闻支持',
                                id: 4022,
                                route: '/newssupportNew',
                                sub: [
                                    {
                                        text: '网易新闻支持',
                                        id: 40221,
                                        icons: '16348.png',
                                        route: '/t304'
                                    },
                                    {
                                        text: '新浪新闻支持',
                                        id: 40222,
                                        icons: 'sina48.png',
                                        route: '/t207'
                                    },
                                    {
                                        text: '搜狐新闻支持',
                                        id: 40223,
                                        icons: 'sohu48.png',
                                        route: '/t404'
                                    },
                                    {
                                        text: '凤凰新闻支持',
                                        id: 40224,
                                        icons: 'ifeng48.png',
                                        route: '/t502'
                                    }
                                ]
                            },
                            {
                                text: '微博直发',
                                id: 4023,
                                route: '',
                                sub: [
                                    {
                                        text: '腾讯微博直发',
                                        id: 40231,
                                        icons: 'qqweibo48.png',
                                        route: '/t101'
                                    },
                                    {
                                        text: '新浪微博直发',
                                        id: 40232,
                                        icons: 'weibo48.png',
                                        route: '/t201'
                                    }
                                ]
                            },
                            {
                                text: '微博评论',
                                id: 4024,
                                route: '',
                                sub: [
                                    {
                                        text: '腾讯微博评论',
                                        id: 40241,
                                        icons: 'qqweibo48.png',
                                        route: '/t102'
                                    },
                                    {
                                        text: '新浪微博评论',
                                        id: 40242,
                                        icons: 'weibo48.png',
                                        route: '/t202'
                                    }
                                ]
                            },
                            {
                                text: '微博转发',
                                id: 4025,
                                route: '',
                                sub: [
                                    {
                                        text: '腾讯微博评论',
                                        id: 40251,
                                        icons: 'qqweibo48.png',
                                        route: '/t103'
                                    },
                                    {
                                        text: '新浪微博评论',
                                        id: 40252,
                                        icons: 'weibo48.png',
                                        route: '/t203'
                                    }
                                ]
                            },
                            {
                                text: '论坛发帖',
                                id: 4026,
                                route: '',
                                sub: [
                                    {
                                        text: '网易论坛发帖',
                                        id: 40261,
                                        icons: '16348.png',
                                        route: '/t301'
                                    },
                                    {
                                        text: '搜狐论坛发帖',
                                        id: 40262,
                                        icons: 'sohu48.png',
                                        route: '/t401'
                                    },
                                    {
                                        text: '新华论坛发帖',
                                        id: 40263,
                                        route: '/t601'
                                    },
                                    {
                                        text: '强国论坛发帖',
                                        id: 40264,
                                        route: '/t701'
                                    }
                                ]
                            },
                            {
                                text: '论坛顶帖',
                                id: 4027,
                                route: '',
                                sub: [
                                    {
                                        text: '网易论坛顶帖',
                                        id: 40271,
                                        icons: '16348.png',
                                        route: '/t302'
                                    },
                                    {
                                        text: '搜狐论坛顶帖',
                                        id: 40272,
                                        icons: 'sohu48.png',
                                        route: '/t402'
                                    },
                                    {
                                        text: '新华论坛发帖',
                                        id: 40273,
                                        route: '/t602'
                                    },
                                    {
                                        text: '强国论坛发帖',
                                        id: 40274,
                                        route: '/t602'
                                    }
                                ]
                            },
                            {
                                text: '通用任务',
                                id: 4027,
                                route: '/newsCommentNew',
                                sub: [
                                    {
                                        text: 'HTTP请求',
                                        id: 40271,
                                        route: '/httprequest'
                                    }
                                ]

                            }
                        ]

                    }
                ]
            },
            //项目管理
            {
                text: '引导项目',
                id: 41,
                route: '/progect',
                sub: [
                    {
                        text: '项目管理',
                        id: 411,
                        route: '/progect',
                        sub: [
                            {
                                id: 4111,
                                text: '详情',
                                route: '/progectdetail'
                            }, {
                                id: 4112,
                                text: '删除',
                                route: '/progectdetele'
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

                    }
                ]
            },
            //任务统计
            {
                text: '任务统计',
                id: 42,
                route: '/taskstatistics'
            }

        ]

    },
    //调度系统
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
            },
            {
                text: '服务器管理',
                id: 52,
                route: '/clientserver',
                sub: [
                    {
                        text: '服务器管理',
                        id: 521,
                        route: '/clientserver'

                    },
                    {
                        text: '登记服务器',
                        id: 522,
                        route: '/addserver'

                    },
                    {
                        text: '服务器统计',
                        id: 523,
                        route: '/statisticsServer'

                    }
                ]
            },
            {
                text: '代理IP',
                id: 53,
                route: '/proxyIP',
                sub: [
                    {
                        text: '代理IP',
                        id: 531,
                        route: '/proxyIP'

                    }
                ]
            }
        ]
    },
    /*
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
     },
     */
    //资源库
    {
        text: '资源库',
        id: 7,
        route: '/resource',
        sub: [{
                text: '资源概况',
                id: 71,
                route: '/resource',
                sub: [
                    {
                        text: '资源统计',
                        id: 711,
                        route: '/resource'

                    }
                ]
            },
            {
                text: '账号管理',
                id: 31,
                route: '',
                sub: [
                    {
                        text: '账号查询',
                        id: 311,
                        route: '/accountsearch',
                        sub: [
                            {
                                text: '账号详情',
                                id: 3111,
                                route: '/accountdetail'
                            },
                            {
                                text: '账号删除',
                                id: 3112,
                                route: '/accountdetele'
                            },
                            {
                                text: '账号编辑',
                                id: 3113,
                                route: '/accountEdit'
                            }
                        ]
                    },
                    {
                        text: '账号导入',
                        id: 312,
                        route: '/accountloadin'
                    },
                    {
                        text: '账号统计',
                        id: 313,
                        route: '/accountstatistics'
                    }
                ]
            },
            {
                text: '机器人资源',
                id: 72,
                route: '/robots',
                sub: [
                    {
                        text: '机器人管理',
                        id: 721,
                        route: '/robots'
                    },
                    {
                        text: '上传机器人',
                        id: 722,
                        route: '/uploadRobots'
                    }
                ]
            }
        ]
    },
    //移动支持
    {
        text: '移动支持',
        id: 8,
        route: '/mobilesupport',
        sub: [
            {
                text: '移动任务',
                id: 81,
                route: '/mobilesupport',
                sub: [
                    {
                        text: '移动任务',
                        id: 811,
                        route: '/mobilesupport',
                        sub: [
                            {
                                text: '任务详情',
                                id: 8111,
                                route: '/mobiletaskDetail'
                            }
                        ]

                    },
                    {
                        text: '添加任务',
                        id: 812,
                        route: '/mslist'
                    },
                    {
                        text: '任务统计',
                        id: 813,
                        route: '/msstatistics'

                    }
                ]

            }, {
                text: '移动终端',
                id: 82,
                route: '/mobileclient',
                sub: [
                    {
                        text: '终端列表',
                        id: 821,
                        route: '/mobileclient'

                    },
                    {
                        text: '终端统计',
                        id: 822,
                        route: '/mclientstatistics'

                    }
                ]

            }
        ]
    },
    //任务系统
    {
        text: '任务系统',
        id: 9,
        route: '/myjobs',
        sub: [
            {
                text: '我的任务',
                id: 91,
                route: '/myjobs',
                sub: [
                    {
                        text: '接收的任务',
                        id: 911,
                        route: '/getjobs'
                    },
                    {
                        text: '下达的任务',
                        id: 912,
                        route: '/sendjobs'
                    },
                    {
                        text: '任务统计',
                        id: 913,
                        route: '/jobsStatistics'
                    }
                ]

            },
            {
                text: '任务统计',
                id: 92,
                route: '/jobsStatistics',
                sub: [
                    {
                        text: '任务统计',
                        id: 921,
                        route: '/jobsStatistics'
                    }
                ]

            }
        ]
    },
    //追踪系统
    {
        text: '追踪系统',
        id: 10,
        route: '/track',
        sub: [
            {
                text: '追踪任务',
                id: 101,
                route: '/trackTask',
                sub: [
                    {
                        text: '任务列表',
                        id: 1011,
                        route: '/trackTask',
                        sub: [
                            {
                                text: '删除追踪',
                                id: 10111,
                                route: '/deletetrack'
                               
                            },
                            {
                                text: '停止追踪',
                                id: 10112,
                                route: '/sotptrack'
                                
                            },
                            {
                                text: '开始追踪',
                                id: 10113,
                                route: '/starttrack'
                               
                            },
                            {
                                text: '追踪报表',
                                id: 10114,
                                route: '/trackreport'
                               
                            }
                        ]
                    }
                ]
            }

        ]
    }
];
module.exports = structure;