import React, { useState } from 'react'
import { Combobox, useCombobox, Group, Avatar, LoadingOverlay, Anchor } from '@mantine/core'
import projectsLogic from './projectsLogic'
import { useActions, useValues } from 'kea'
import { A, router } from 'kea-router'
import { modals } from '@mantine/modals'
import { CreateProjectForm } from './create/CreateProjectForm'
import { urls } from '../urls'
import { Project } from './ProjectsData'


interface CustomComboboxProps {
    children: React.ReactNode
}

function didClickAddProject() {
    modals.open({
        title: 'New Project',
        children: <CreateProjectForm />
    })
}

function didClickProject(project: Project) {
    router.actions.push(urls.apps(project.id))
}

const ProjectsCombobox = ({ children }: CustomComboboxProps): JSX.Element => {
    const { projects, projectsLoading } = useValues(projectsLogic)
    const [search, setSearch] = useState('');
    const combobox = useCombobox({
        onDropdownClose: () => {
            combobox.resetSelectedOption();
            combobox.focusTarget();
            setSearch('');
        },

        onDropdownOpen: () => {
            combobox.focusSearchInput();
        },
    })

    const options = projects
        .filter((project) => project.name.toLowerCase().includes(search.toLowerCase().trim()))
        .map((project) => (
            <Combobox.Option value={project.id.toString()} key={project.id} onClick={() => { didClickProject(project) }}>
                <Group w={"100%"}>
                    {project.avatar_url ? (
                        <Avatar
                            src={project.avatar_url}
                            size="md"
                            radius="md"
                        />
                    ) : (
                        <Avatar color="blue" radius="md">{project.initials}</Avatar>
                    )}
                    {project.name}
                </Group>
            </Combobox.Option>
        ));

    return (
        <Combobox
            store={combobox}
            styles={{ dropdown: { minWidth: 200 } }}
            position="bottom-start"
            transitionProps={{ transition: 'pop-bottom-left', duration: 150 }}
            onOptionSubmit={(val) => {
                combobox.closeDropdown();
            }}
        >
            <Combobox.Target withAriaAttributes={false}>
                <div onClick={(event) => { event.preventDefault(); combobox.openDropdown(); }}>
                    {children}
                </div>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Search
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder="Search projects"
                />
                {projectsLoading ? (
                    <LoadingOverlay />
                ) : (
                    <Combobox.Options>
                        {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
                    </Combobox.Options>
                )}
                <Combobox.Footer>
                    <Group justify='center'>
                        <Anchor size="sm" onClick={() => {
                            combobox.closeDropdown()
                            didClickAddProject()
                        }}>
                            Create new Project
                        </Anchor>
                    </Group>
                </Combobox.Footer>
            </Combobox.Dropdown>
        </Combobox>
    );
};

export default ProjectsCombobox;