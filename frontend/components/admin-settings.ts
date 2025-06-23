export const AdminSettingsPanel = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const AdminSettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h2>{title}</h2>
        {children}
    </div>
);
export const AdminSettingsItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label>{label}</label>
        {children}
    </div>
);
export const AdminSettingsSwitch = ({ checked, onChange }: { checked: boolean; onChange: (e: any) => void }) => (
    <input type="checkbox" checked={checked} onChange={onChange} />
);
export const AdminSettingsInput = ({ type, value, onChange }: { type: string; value: string; onChange: (e: any) => void }) => (
    <input type={type} value={value} onChange={onChange} />
);
export const AdminSettingsButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
);
export const AdminSettingsSelect = ({ value, onChange, children }: { value: string; onChange: (e: any) => void; children: React.ReactNode }) => (
    <select value={value} onChange={onChange}>{children}</select>
);
export const AdminSettingsTextArea = ({ value, onChange }: { value: string; onChange: (e: any) => void }) => (
    <textarea value={value} onChange={onChange}></textarea>
);
export const AdminSettingsCheckboxGroup = ({ options, value, onChange }: { options: any[]; value: any[]; onChange: (values: any[]) => void }) => (
    <div>
        {options.map((option) => (
            <label key={option.value}>
                <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => {
                        const newValue = value.includes(option.value)
                            ? value.filter((v) => v !== option.value)
                            : [...value, option.value];
                        onChange(newValue);
                    }}
                />
                {option.label}
            </label>
        ))}
    </div>
);
export const AdminSettingsRadioGroup = ({ options, value, onChange }: { options: any[]; value: string; onChange: (e: any) => void }) => (
    <div>
        {options.map((option) => (
            <label key={option.value}>
                <input
                    type="radio"
                    checked={value === option.value}
                    onChange={() => onChange(option.value)}
                />
                {option.label}
            </label>
        ))}
    </div>
);
export const AdminSettingsDatePicker = ({ value, onChange }: { value: string; onChange: (e: any) => void }) => (
    <input type="date" value={value} onChange={onChange} />
);

export const AdminSettingsTimePicker = ({ value, onChange }: { value: string; onChange: (e: any) => void }) => (
    <input type="time" value={value} onChange={onChange} />
);

export const AdminSettingsColorPicker = ({ value, onChange }: { value: string; onChange: (e: any) => void }) => (
    <input type="color" value={value} onChange={onChange} />
);

export const AdminSettingsFileUpload = ({ onChange }: { onChange: (e: any) => void }) => (
    <input type="file" onChange={onChange} />
);

export const AdminSettingsRange = ({ value, onChange }: { value: number; onChange: (e: any) => void }) => (
    <input type="range" value={value} onChange={onChange} />
);

export const AdminSettingsKeyValue = ({ pairs }: { pairs: { key: string; value: string }[] }) => (
    <ul>
        {pairs.map((pair, index) => (
            <li key={index}>
                {pair.key}: {pair.value}
            </li>
        ))}
    </ul>
);

export const AdminSettingsCodeEditor = ({ code, onChange }: { code: string; onChange: (code: string) => void }) => (
    <textarea value={code} onChange={(e) => onChange(e.target.value)} />
);

export const AdminSettingsAlert = ({ message }: { message: string }) => (
    <div role="alert">{message}</div>
);

export const AdminSettingsTabs = ({ tabs }: { tabs: { title: string; content: React.ReactNode }[] }) => (
    <div>
        {tabs.map((tab, index) => (
            <div key={index}>
                <h3>{tab.title}</h3>
                <div>{tab.content}</div>
            </div>
        ))}
    </div>
);

export const AdminSettingsModal = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => (
    isOpen ? <div>{children}</div> : null
);

export const AdminSettingsDrawer = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => (
    isOpen ? <aside>{children}</aside> : null
);

export const AdminSettingsAccordion = ({ items }: { items: { title: string; content: React.ReactNode }[] }) => (
    <div>
        {items.map((item, index) => (
            <div key={index}>
                <h3>{item.title}</h3>
                <div>{item.content}</div>
            </div>
        ))}
    </div>
);

export const AdminSettingsCarousel = ({ items }: { items: React.ReactNode[] }) => (
    <div>
        {items.map((item, index) => (
            <div key={index}>{item}</div>
        ))}
    </div>
);
