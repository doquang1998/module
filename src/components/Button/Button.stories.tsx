import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Button from './Button';

// You can learn about this: https://storybook.js.org/docs/react/writing-stories/introduction

export default { 
    title: 'Button',
    component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({});
Primary.args = {
    label: "Primary"
}

export const Secondary = Template.bind({})
Secondary.args = {
    label: "Secondary"
}