import React from "react";
import { ComponentStory, ComponentMeta, StoryFn } from "@storybook/react";
import ProfileNavBar from ".";

// You can learn about this: https://storybook.js.org/docs/react/writing-stories/introduction

export default {
  title: "ProfileNavBar",
  component: ProfileNavBar,
}

const Template: StoryFn<any> = (args) => <ProfileNavBar {...args} />;

export const ProfileNavBarPage = Template.bind({
  handleUpdateAvatar: () => {},
});