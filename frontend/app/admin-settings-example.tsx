'use client';

import type React from 'react';
import { useState } from 'react';
import {
  AdminSettingsPanel,
  AdminSettingsSection,
  AdminSettingsItem,
  AdminSettingsSwitch,
  AdminSettingsInput,
  AdminSettingsButton,
  AdminSettingsSelect,
  AdminSettingsTextArea,
  AdminSettingsCheckboxGroup,
  AdminSettingsRadioGroup,
  AdminSettingsDatePicker,
  AdminSettingsTimePicker,
  AdminSettingsColorPicker,
  AdminSettingsFileUpload,
  AdminSettingsRange,
  AdminSettingsKeyValue,
  AdminSettingsCodeEditor,
  AdminSettingsAlert,
  AdminSettingsTabs,
  AdminSettingsTab,
  AdminSettingsTable,
  AdminSettingsModal,
  AdminSettingsDrawer,
  AdminSettingsSteps,
  AdminSettingsStep,
  AdminSettingsList,
  AdminSettingsListItem,
  AdminSettingsAccordion,
  AdminSettingsAccordionItem,
  AdminSettingsCarousel,
  AdminSettingsCarouselItem,
  AdminSettingsTimeline,
  AdminSettingsTree,
  AdminSettingsBreadcrumbs,
  AdminSettingsPagination,
  AdminSettingsAvatar,
  AdminSettingsBadge,
  AdminSettingsProgress,
  AdminSettingsSkeleton,
  AdminSettingsSpinner,
  AdminSettingsTooltip,
  AdminSettingsPopover,
  AdminSettingsDropdown,
  AdminSettingsMenu,
  AdminSettingsMenuItem,
  AdminSettingsContextMenu,
  AdminSettingsCommandPalette,
  AdminSettingsDialog,
  AdminSettingsConfirmDialog,
  AdminSettingsPromptDialog,
  AdminSettingsSnackbar,
  AdminSettingsToast,
} from '../components/admin-settings';

// Ajustar el tipo de settings para incluir todas las propiedades necesarias
interface Settings {
  isDarkMode?: boolean;
  username?: string;
  email?: string;
  selectedRole?: string;
  notificationsEnabled?: boolean;
  customMessage?: string;
  termsAccepted?: string[];
  securityLevel?: string;
  birthdate?: Date;
  meetingTime?: Date;
  primaryColor?: string;
  profilePicture?: File;
  volume?: number;
  apiKey?: { key: string; value: string };
  code?: string;
  showAlert?: boolean;
  activeTab?: string;
  tableData?: any[];
  isModalOpen?: boolean;
  isDrawerOpen?: boolean;
  currentStep?: number;
  items?: string[];
  expanded?: string;
  currentSlide?: number;
  timelineItems?: any[];
  treeData?: any[];
  currentPage?: number;
  avatarUrl?: string;
  badgeCount?: number;
  progressValue?: number;
  isLoading?: boolean;
  showTooltip?: boolean;
  showPopover?: boolean;
  selectedOption?: string;
  showContextMenu?: boolean;
  showCommandPalette?: boolean;
  showDialog?: boolean;
  showConfirmDialog?: boolean;
  showPromptDialog?: boolean;
  showSnackbar?: boolean;
  showToast?: boolean;
}

const AdminSettingsExample = () => {
  const [settings, setSettings] = useState<Settings>({});

  return (
    <AdminSettingsPanel>
      <AdminSettingsSection title="General Settings">
        <AdminSettingsItem label="Dark Mode">
          <AdminSettingsSwitch
            checked={settings.isDarkMode}
            onChange={(e) =>
              setSettings({ ...settings, isDarkMode: e.target.checked })
            }
          />
        </AdminSettingsItem>
        <AdminSettingsItem label="Username">
          <AdminSettingsInput
            type="text"
            value={settings.username}
            onChange={(e) =>
              setSettings({ ...settings, username: e.target.value })
            }
          />
        </AdminSettingsItem>
        <AdminSettingsItem label="Email">
          <AdminSettingsInput
            type="email"
            value={settings.email}
            onChange={(e) =>
              setSettings({ ...settings, email: e.target.value })
            }
          />
        </AdminSettingsItem>
        <AdminSettingsItem label="Role">
          <AdminSettingsSelect
            value={settings.selectedRole}
            onChange={(e) =>
              setSettings({ ...settings, selectedRole: e.target.value })
            }
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </AdminSettingsSelect>
        </AdminSettingsItem>
      </AdminSettingsSection>

      <AdminSettingsSection title="Notifications">
        <AdminSettingsItem label="Enable Notifications">
          <AdminSettingsSwitch
            checked={settings.notificationsEnabled}
            onChange={(e) =>
              setSettings({
                ...settings,
                notificationsEnabled: e.target.checked,
              })
            }
          />
        </AdminSettingsItem>
      </AdminSettingsSection>

      <AdminSettingsSection title="Customization">
        <AdminSettingsItem label="Custom Message">
          <AdminSettingsTextArea
            value={settings.customMessage}
            onChange={(e) =>
              setSettings({ ...settings, customMessage: e.target.value })
            }
          />
        </AdminSettingsItem>
      </AdminSettingsSection>

      <AdminSettingsSection title="Preferences">
        <AdminSettingsItem label="Terms Accepted">
          <AdminSettingsCheckboxGroup
            options={[
              { label: 'Terms of Service', value: 'terms' },
              { label: 'Privacy Policy', value: 'privacy' },
            ]}
            value={settings.termsAccepted}
            onChange={(values) =>
              setSettings({ ...settings, termsAccepted: values })
            }
          />
        </AdminSettingsItem>
        <AdminSettingsItem label="Security Level">
          <AdminSettingsRadioGroup
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
            ]}
            value={settings.securityLevel}
            onChange={(e) =>
              setSettings({ ...settings, securityLevel: e.target.value })
            }
          />
        </AdminSettingsItem>
      </AdminSettingsSection>

      <AdminSettingsSection title="Date and Time">
        <AdminSettingsItem label="Birthdate">
          <AdminSettingsDatePicker
            selected={settings.birthdate}
            onChange={(date) => setSettings({ ...settings, birthdate: date })}
          />
        </AdminSettingsItem>
        <AdminSettingsItem label="Meeting Time">
          <AdminSettingsTimePicker
            selected={settings.meetingTime}
            onChange={(date) => setSettings({ ...settings, meetingTime: date })}
          />
        </AdminSettingsItem>
      </AdminSettingsSection>

      <AdminSettingsSection title="Appearance">
        <AdminSettingsItem label="Primary Color">
          <AdminSettingsColorPicker
            color={settings.primaryColor}
            onChange={(color) =>
              setSettings({ ...settings, primaryColor: color })
            }
          />
        </AdminSettingsItem>
        <AdminSettingsItem label="Profile Picture">
          <AdminSettingsFileUpload
            onChange={(files) =>
              setSettings({ ...settings, profilePicture: files[0] })
            }
          />
        </AdminSettingsItem>
      </AdminSettingsSection>

      <AdminSettingsSection title="Media">
        <AdminSettingsItem label="Volume">
          <AdminSettingsRange
            value={settings.volume}
            onChange={(e) =>
              setSettings({ ...settings, volume: Number(e.target.value) })
            }
          />
        </AdminSettingsItem>
      </AdminSettingsSection>

      <AdminSettingsSection title="API">
        <AdminSettingsItem label="API Key">
          <AdminSettingsKeyValue
            keyName="key"
            valueName="value"
            value={settings.apiKey}
            onChange={(key, value) =>
              setSettings({ ...settings, apiKey: { key, value } })
            }
          />
        </AdminSettingsItem>
      </AdminSettingsSection>

      <AdminSettingsSection title="Code Editor">
        <AdminSettingsItem label="Code">
          <AdminSettingsCodeEditor
            value={settings.code}
            onChange={(value) => setSettings({ ...settings, code: value })}
          />
        </AdminSettingsItem>
      </AdminSettingsSection>

      <AdminSettingsSection title="Alerts">
        <AdminSettingsItem label="Show Alert">
          <AdminSettingsButton
            onClick={() => setSettings({ ...settings, showAlert: true })}
          >
            Show Alert
          </AdminSettingsButton>
          {settings.showAlert && (
            <AdminSettingsAlert
              type="success"
              message="This is a success alert!"
            />
          )}
        </AdminSettingsItem>
      </AdminSettingsSection>

      <AdminSettingsSection title="Tabs">
        <AdminSettingsTabs
          activeKey={settings.activeTab}
          onChange={(key) => setSettings({ ...settings, activeTab: key })}
        >
          <AdminSettingsTab key="general" title="General">
            <div>General content</div>
          </AdminSettingsTab>
          <AdminSettingsTab key="advanced" title="Advanced">
            <div>Advanced content</div>
          </AdminSettingsTab>
        </AdminSettingsTabs>
      </AdminSettingsSection>

      <AdminSettingsSection title="Table">
        <AdminSettingsTable
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Value', dataIndex: 'value', key: 'value' },
          ]}
          dataSource={settings.tableData}
          onChange={(data) => setSettings({ ...settings, tableData: data })}
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Modal">
        <AdminSettingsButton
          onClick={() => setSettings({ ...settings, isModalOpen: true })}
        >
          Open Modal
        </AdminSettingsButton>
        <AdminSettingsModal
          isOpen={settings.isModalOpen}
          onClose={() => setSettings({ ...settings, isModalOpen: false })}
          title="Modal Title"
        >
          Modal Content
        </AdminSettingsModal>
      </AdminSettingsSection>

      <AdminSettingsSection title="Drawer">
        <AdminSettingsButton
          onClick={() => setSettings({ ...settings, isDrawerOpen: true })}
        >
          Open Drawer
        </AdminSettingsButton>
        <AdminSettingsDrawer
          isOpen={settings.isDrawerOpen}
          onClose={() => setSettings({ ...settings, isDrawerOpen: false })}
          title="Drawer Title"
        >
          Drawer Content
        </AdminSettingsDrawer>
      </AdminSettingsSection>

      <AdminSettingsSection title="Steps">
        <AdminSettingsSteps current={settings.currentStep}>
          <AdminSettingsStep title="Step 1" description="Description 1" />
          <AdminSettingsStep title="Step 2" description="Description 2" />
          <AdminSettingsStep title="Step 3" description="Description 3" />
        </AdminSettingsSteps>
        {settings.currentStep > 0 && (
          <AdminSettingsButton
            onClick={() =>
              setSettings({
                ...settings,
                currentStep: settings.currentStep - 1,
              })
            }
          >
            Previous
          </AdminSettingsButton>
        )}
        {settings.currentStep < 2 && (
          <AdminSettingsButton
            onClick={() =>
              setSettings({
                ...settings,
                currentStep: settings.currentStep + 1,
              })
            }
          >
            Next
          </AdminSettingsButton>
        )}
      </AdminSettingsSection>

      <AdminSettingsSection title="List">
        <AdminSettingsList
          dataSource={settings.items}
          renderItem={(item, index) => (
            <AdminSettingsListItem key={index}>
              {item}
              <AdminSettingsButton
                onClick={() => {
                  const newItems = settings.items.filter((_, i) => i !== index);
                  setSettings({ ...settings, items: newItems });
                }}
              >
                Remove
              </AdminSettingsButton>
            </AdminSettingsListItem>
          )}
          addItem={(item) =>
            setSettings({ ...settings, items: [...settings.items, item] })
          }
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Accordion">
        <AdminSettingsAccordion
          expanded={settings.expanded}
          onChange={(panel) => setSettings({ ...settings, expanded: panel })}
        >
          <AdminSettingsAccordionItem title="Panel 1" name="panel1">
            Content of Panel 1
          </AdminSettingsAccordionItem>
          <AdminSettingsAccordionItem title="Panel 2" name="panel2">
            Content of Panel 2
          </AdminSettingsAccordionItem>
        </AdminSettingsAccordion>
      </AdminSettingsSection>

      <AdminSettingsSection title="Carousel">
        <AdminSettingsCarousel current={settings.currentSlide}>
          <AdminSettingsCarouselItem>Slide 1</AdminSettingsCarouselItem>
          <AdminSettingsCarouselItem>Slide 2</AdminSettingsCarouselItem>
          <AdminSettingsCarouselItem>Slide 3</AdminSettingsCarouselItem>
        </AdminSettingsCarousel>
        <AdminSettingsButton
          onClick={() => {
            const prevSlide = (settings.currentSlide - 1 + 3) % 3;
            setSettings({ ...settings, currentSlide: prevSlide });
          }}
        >
          Previous
        </AdminSettingsButton>
        <AdminSettingsButton
          onClick={() => {
            const nextSlide = (settings.currentSlide + 1) % 3;
            setSettings({ ...settings, currentSlide: nextSlide });
          }}
        >
          Next
        </AdminSettingsButton>
      </AdminSettingsSection>

      <AdminSettingsSection title="Timeline">
        <AdminSettingsTimeline
          items={settings.timelineItems}
          onChange={(items) =>
            setSettings({ ...settings, timelineItems: items })
          }
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Tree">
        <AdminSettingsTree
          data={settings.treeData}
          onChange={(data) => setSettings({ ...settings, treeData: data })}
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Breadcrumbs">
        <AdminSettingsBreadcrumbs items={['Home', 'Settings', 'Admin']} />
      </AdminSettingsSection>

      <AdminSettingsSection title="Pagination">
        <AdminSettingsPagination
          current={settings.currentPage}
          total={50}
          onChange={(page) => setSettings({ ...settings, currentPage: page })}
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Avatar">
        <AdminSettingsAvatar
          src={settings.avatarUrl}
          onChange={(url) => setSettings({ ...settings, avatarUrl: url })}
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Badge">
        <AdminSettingsBadge
          count={settings.badgeCount}
          onChange={(count) => setSettings({ ...settings, badgeCount: count })}
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Progress">
        <AdminSettingsProgress
          value={settings.progressValue}
          onChange={(value) =>
            setSettings({ ...settings, progressValue: value })
          }
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Skeleton">
        <AdminSettingsSkeleton loading={settings.isLoading} />
      </AdminSettingsSection>

      <AdminSettingsSection title="Spinner">
        <AdminSettingsSpinner loading={settings.isLoading} />
      </AdminSettingsSection>

      <AdminSettingsSection title="Tooltip">
        <AdminSettingsTooltip
          title="Tooltip text"
          visible={settings.showTooltip}
        >
          <AdminSettingsButton
            onClick={() =>
              setSettings({ ...settings, showTooltip: !settings.showTooltip })
            }
          >
            Toggle Tooltip
          </AdminSettingsButton>
        </AdminSettingsTooltip>
      </AdminSettingsSection>

      <AdminSettingsSection title="Popover">
        <AdminSettingsPopover
          content="Popover content"
          visible={settings.showPopover}
        >
          <AdminSettingsButton
            onClick={() =>
              setSettings({ ...settings, showPopover: !settings.showPopover })
            }
          >
            Toggle Popover
          </AdminSettingsButton>
        </AdminSettingsPopover>
      </AdminSettingsSection>

      <AdminSettingsSection title="Dropdown">
        <AdminSettingsDropdown
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
          ]}
          value={settings.selectedOption}
          onChange={(e) =>
            setSettings({ ...settings, selectedOption: e.target.value })
          }
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Menu">
        <AdminSettingsMenu>
          <AdminSettingsMenuItem>Menu Item 1</AdminSettingsMenuItem>
          <AdminSettingsMenuItem>Menu Item 2</AdminSettingsMenuItem>
        </AdminSettingsMenu>
      </AdminSettingsSection>

      <AdminSettingsSection title="Context Menu">
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setSettings({ ...settings, showContextMenu: true });
          }}
        >
          Right-click here
          {settings.showContextMenu && (
            <AdminSettingsContextMenu
              onClose={() =>
                setSettings({ ...settings, showContextMenu: false })
              }
            >
              <AdminSettingsMenuItem>Context Menu Item 1</AdminSettingsMenuItem>
              <AdminSettingsMenuItem>Context Menu Item 2</AdminSettingsMenuItem>
            </AdminSettingsContextMenu>
          )}
        </div>
      </AdminSettingsSection>

      <AdminSettingsSection title="Command Palette">
        <AdminSettingsButton
          onClick={() => setSettings({ ...settings, showCommandPalette: true })}
        >
          Open Command Palette
        </AdminSettingsButton>
        <AdminSettingsCommandPalette
          isOpen={settings.showCommandPalette}
          onClose={() =>
            setSettings({ ...settings, showCommandPalette: false })
          }
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Dialog">
        <AdminSettingsButton
          onClick={() => setSettings({ ...settings, showDialog: true })}
        >
          Open Dialog
        </AdminSettingsButton>
        <AdminSettingsDialog
          isOpen={settings.showDialog}
          onClose={() => setSettings({ ...settings, showDialog: false })}
          title="Dialog Title"
        >
          Dialog Content
        </AdminSettingsDialog>
      </AdminSettingsSection>

      <AdminSettingsSection title="Confirm Dialog">
        <AdminSettingsButton
          onClick={() => setSettings({ ...settings, showConfirmDialog: true })}
        >
          Open Confirm Dialog
        </AdminSettingsButton>
        <AdminSettingsConfirmDialog
          isOpen={settings.showConfirmDialog}
          onClose={() => setSettings({ ...settings, showConfirmDialog: false })}
          title="Confirm Dialog Title"
          onConfirm={() => {}}
          onCancel={() => {}}
        >
          Confirm Dialog Content
        </AdminSettingsConfirmDialog>
      </AdminSettingsSection>

      <AdminSettingsSection title="Prompt Dialog">
        <AdminSettingsButton
          onClick={() => setSettings({ ...settings, showPromptDialog: true })}
        >
          Open Prompt Dialog
        </AdminSettingsButton>
        <AdminSettingsPromptDialog
          isOpen={settings.showPromptDialog}
          onClose={() => setSettings({ ...settings, showPromptDialog: false })}
          title="Prompt Dialog Title"
          onConfirm={(value) => {}}
          onCancel={() => {}}
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Snackbar">
        <AdminSettingsButton
          onClick={() => setSettings({ ...settings, showSnackbar: true })}
        >
          Show Snackbar
        </AdminSettingsButton>
        <AdminSettingsSnackbar
          isOpen={settings.showSnackbar}
          onClose={() => setSettings({ ...settings, showSnackbar: false })}
          message="Snackbar message"
        />
      </AdminSettingsSection>

      <AdminSettingsSection title="Toast">
        <AdminSettingsButton
          onClick={() => setSettings({ ...settings, showToast: true })}
        >
          Show Toast
        </AdminSettingsButton>
        <AdminSettingsToast
          isOpen={settings.showToast}
          onClose={() => setSettings({ ...settings, showToast: false })}
          message="Toast message"
        />
      </AdminSettingsSection>

      {/* Chat components would go here, but are omitted for brevity */}
    </AdminSettingsPanel>
  );
};

export default AdminSettingsExample;
