import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import parse from 'html-react-parser';
import Profile from '../Profile/Profile';
import { PieChart } from 'react-minimal-pie-chart';
import './chart.css'

export default function Chart() {
    return (
        <div>
            <Profile />
            <div className='allChart'>
                <div className='QuesChart'>
                    <div className='title'>No of asked questions</div>

                    <div>
                        <PieChart lineWidth='60' viewBoxSize={[100, 100]}
                            data={[
                                { title: 'React', value: 10, color: '#E38627' },
                                { title: 'Node', value: 25, color: '#C13C37' },
                                { title: 'Mongo', value: 5, color: '#6A2135' },
                            ]}
                        />
                    </div>
                </div>

                <div className='QuesChart'>
                    <div className='title'>No of given answers.</div>

                    <div>
                        <PieChart lineWidth='60' viewBoxSize={[100, 100]}
                            data={[
                                { title: 'MERN', value: 35, color: '#E38627' },
                                { title: 'Node', value: 25, color: '#C13C37' },
                                { title: 'Mongo', value: 5, color: '#6A2135' },
                            ]}
                        />

                    </div>
                </div>

                <div className='QuesChart'>
                    <div className='title'>No of accepted answers</div>

                    <div>
                        <PieChart lineWidth='60' viewBoxSize={[100, 100]}
                            data={[
                                { title: 'React', value: 5, color: '#E38627' },
                                { title: 'Node', value: 5, color: '#C13C37' },
                                { title: 'Mongo', value: 55, color: '#6A2135' },
                            ]}
                        />
                    </div>
                </div>
            </div>

            <hr Style="border: 0.7px solid" />
        </div>
    );
}