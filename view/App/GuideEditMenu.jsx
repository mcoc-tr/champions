import guides from '../../data/guides';
import lang from '../../service/lang';
import MenuHeader from '../Menu/MenuHeader.jsx';
import MenuOption from '../Menu/MenuOption.jsx';
import Icon from '../Icon.jsx';
import { notify } from '../../util/notification';
import { clickElementById } from '../../util/element';
import { loadFileFromInput, saveFileEventHandler } from '../../util/io';
import { requestRedraw } from '../../util/animation';
/* eslint-disable no-unused-vars */
import m from 'mithril';
/* eslint-enable no-unused-vars */

const GuideEditMenu = {
    view(ctrl, { uid }) {
        const options = [];
        options.push(
            <MenuHeader title={ `champion-${ uid }-name` } />
        );
        if (window.FileReader) {
            const handleTextInput = (text) => {
                guides[ uid ] = JSON.parse(text);
                notify({
                    message: lang.string('notification-guide-import'),
                    tag: 'guide-import',
                });
                requestRedraw(5);
            };
            options.push(
                <MenuOption
                    icon={(
                        <Icon icon="clipboard" before />
                    )}
                    title="import-json"
                    onclick={ () => {
                        clickElementById('guide-importer');
                        m.redraw.strategy('none');
                    } }
                />
            );
            options.push(
                <input
                    id="guide-importer"
                    style="display:none"
                    type="file"
                    accept=".json"
                    value=""
                    onchange={ function() {
                        /* eslint-disable no-invalid-this */
                        loadFileFromInput(this, handleTextInput);
                        /* eslint-enable no-invalid-this */
                    } }
                />
            );
        }
        const filename = `${ uid }.json`;
        options.push(
            <MenuOption
                icon={(
                    <Icon icon="floppy-o" before />
                )}
                title="export-json"
                download={ filename }
                onclick={ ({ target }) => {
                    saveFileEventHandler(target, 'text/json', filename, JSON.stringify(guides[ uid ] || {}, null, 4));
                    requestRedraw(5);
                }}
                oncontextmenu={ ({ target }) => {
                    saveFileEventHandler(target, 'text/json', filename, JSON.stringify(guides[ uid ] || {}, null, 4));
                    m.redraw.strategy('none');
                }}
            />
        );
        return (
            <div m="GuideEditMenu" key={ 'guide-edit-menu' }>
                { options }
            </div>
        );
    },
};

export default GuideEditMenu;
