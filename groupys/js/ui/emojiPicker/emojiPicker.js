import React from 'react'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {Container, Drawer, Fab, Icon, Tab, TabHeading, Tabs} from "native-base";
/* list of emoji's sourced from http://getemoji.com */
const PEOPLE_EMOJIS = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '😇', '☺️', '😊', '🙂', '🙃', '😉', '😌', '😍', '😘', '😗', '😙', '😚', '😋', '😜', '😝', '😛', '🤑', '🤗', '🤓', '😎', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '😤', '😠', '😡', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '😵', '😳', '😱', '😨', '😰', '😢', '😥', '😭', '😓', '😪', '😴', '🙄', '🤔', '😬', '🤐', '😷', '🤒', '🤕', '😈', '👿', '👹', '👺', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👐', '🙌', '👏', '🙏', '👍', '👎', '👊', '✊', '✌️', '🤘', '👌', '👈', '👉', '👆', '👇', '☝️', '✋', '🖐', '🖖', '👋', '💪', '🖕', '✍️', '💅', '🖖', '💄', '💋', '👄', '👅', '👂', '👃', '👣', '👁', '👀', '👗', '👠', '👞', '👟', '👒', '🎩', '🎓', '👑', '⛑', '🎒', '👝', '👛', '👜', '💼', '👓', '🕶', '☂️']
const ANIMALS_NATURE_EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙊', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🐌', '🐚', '🐞', '🐜', '🕷', '🕸', '🐢', '🐍', '🦂', '🦀', '🐙', '🐠', '🐟', '🐡', '🐬', '🐳', '🐋', '🐊', '🐆', '🐅', '🐃', '🐂', '🐄', '🐫', '🐘', '🐎', '🐖', '🐐', '🐏', '🐑', '🐕', '🐩', '🐈', '🐓', '🦃', '🕊', '🐇', '🐁', '🐀', '🐿', '🐾', '🐉', '🐲', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🥀', '🌻', '🌼', '🌸', '🌺', '🌎', '🌍', '🌏', '🌕', '🌖', '🌔', '🌚', '🌝', '🌞', '🌛', '🌜', '🌙', '💫', '⭐️', '🌟', '✨', '⚡️', '🔥', '💥', '☄️', '☀️', '🌤', '⛅️', '🌥', '🌦', '🌈', '☁️', '🌧', '⛈', '🌩', '🌨', '☃️', '⛄️', '❄️', '🌬', '💨', '🌪', '🌫', '🌊', '💧', '💦', '☔️']
const FOOD_SPORTS_EMOJIS = ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🍅', '🍆', '🌽', '🌶', '🍠', '🌰', '🍯', '🍞', '🧀', '🍳', '🍤', '🍗', '🍖', '🍕', '🌭', '🍔', '🍟', '🌮', '🌯', '🍝', '🍜', '🍲', '🍥', '🍣', '🍱', '🍛', '🍚', '🍙', '🍘', '🍢', '🍡', '🍧', '🍨', '🍦', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🍼', '☕️', '🍵', '🍶', '🍺', '🍻', '🍷', '🍸', '🍹', '🍾', '🍴', '🍽', '⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🏏', '⛳️', '🏹', '🎣', '⛸', '🎿', '⛷', '🏂', '🏋', '⛹️', '🏌', '🏄', '🏊', '🚣', '🏇', '🚴', '🚵', '🎬', '🎤', '🎧', '🎼', '🎹', '🎷', '🎺', '🎸', '🎻', '🎲', '🎯', '🎳', '🎮', '🏁', '🏆']
const TRAVEL_PLACES_EMOJIS = ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🚲', '🏍', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '🚁', '🛩', '✈️', '🛫', '🛬', '🚀', '🛰', '💺', '⛵️', '🛥', '🚤', '🛳', '⛴', '🚢', '⚓️', '🚧', '⛽️', '🚏', '🚦', '🚥', '🗺', '🗿', '🗽', '⛲️', '🗼', '🏰', '🏯', '🏟', '🎡', '🎢', '🎠', '⛱', '🏖', '🏝', '⛰', '🏔', '🗻', '🌋', '🏜', '🏕', '⛺️', '🛤', '🛣', '🏗', '🏭', '🏠', '🏡', '🏘', '🏚', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛', '⛪️', '🕌', '🕍', '🕋', '⛩', '🗾', '🎑', '🏞', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙', '🌃', '🌌', '🌉', '🌁', '🎨']
const OBJECTS_EMOJIS = ['🆓', '📗', '📕', '⌚️', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '⏱', '⏲', '⏰', '🕰', '⌛️', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯', '🗑', '🛢', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🔧', '🔨', '⚒', '⛏', '⚙️', '💣', '🔪', '🗡', '⚔️', '🛡', '⚰️', '⚱️', '🏺', '🔮', '📿', '💈', '⚗️', '🔭', '🔬', '🕳', '💊', '💉', '🌡', '🚽', '🚰', '🚿', '🛁', '🛀', '🛎', '🔑', '🗝', '🚪', '🛋', '🛏', '🖼', '🛍', '🎁', '🎈', '🎏', '🎀', '🎊', '🎉', '🎎', '🏮', '🎐', '✉️', '📪', '📮', '📯', '📜', '📃', '📄', '📑', '📊', '📈', '📉', '🗒', '🗓', '📆', '📅', '📇', '🗃', '🗳', '🗄', '📋', '🗞', '📰', '📘', '📚', '📖', '🔖', '🔗', '📎', '📐', '📏', '📌', '🖊', '🖌', '🖍', '📝', '✏️', '🔍', '🔓']
const SYMBOLS_FLAGS_EMOJIS = ['❤️', '💛', '💚', '💙', '💜', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈️', '♉️', '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️', '♑️', '♒️', '♓️', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '❌', '⭕️', '⛔️', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❕', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🚺', '🚼', '🎵', '🎶', '➕', '➖', '➗', '✖️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '✔️', '☑️', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '🗨', '💬', '💭', '🗯', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴']
export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            emojis: PEOPLE_EMOJIS,
            emojiCategory: 'PEOPLE_EMOJIS'
        }
    }



    onEmojiSelect(emoji) {
        this.props.onEmojiSelect(emoji)
    }

    render() {
        return (
            <View style={{flex: 5, padding: 10}}>
                <Tabs tabBarUnderlineStyle={{backgroundColor: '#2db6c8'}} initialPage={0}
                      style={{backgroundColor: '#fff',}}>
                    <Tab heading={<TabHeading style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "white"
                    }}><Text style={{height: 35, fontSize: 30}}>😀</Text></TabHeading>}>
                        {this.createEmojies(PEOPLE_EMOJIS)}
                    </Tab>
                    <Tab heading={<TabHeading style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "white"
                    }}><Text style={{height: 35, fontSize: 30}}>🐼</Text></TabHeading>}>
                        {this.createEmojies(ANIMALS_NATURE_EMOJIS)}
                    </Tab>
                    <Tab heading={<TabHeading style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "white"
                    }}><Text style={{height: 35, fontSize: 30}}>🍏</Text></TabHeading>}>
                        {this.createEmojies(FOOD_SPORTS_EMOJIS)}
                    </Tab>
                    <Tab heading={<TabHeading style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "white"
                    }}><Text style={{height: 35, fontSize: 30}}>🚘</Text></TabHeading>}>
                        {this.createEmojies(TRAVEL_PLACES_EMOJIS)}
                    </Tab>
                    <Tab heading={<TabHeading style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "white"
                    }}><Text style={{height: 35, fontSize: 30}}>💎</Text></TabHeading>}>
                        {this.createEmojies(OBJECTS_EMOJIS)}
                    </Tab>
                    <Tab heading={<TabHeading style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "white"
                    }}><Text style={{height: 35, fontSize: 30}} >❤</Text></TabHeading>}>
                        {this.createEmojies(SYMBOLS_FLAGS_EMOJIS)}
                    </Tab>


                </Tabs>

            </View>
        )
    }

    createEmojies(emojis) {
        return <ScrollView>
            <View style={{flexDirection: 'row', alignSelf: 'stretch', flexWrap: 'wrap'}}>
                {
                    emojis.map((emoji, index) => (
                        <TouchableOpacity style={{
                            height: 40,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                                          key={index}
                                          onPress={() => {
                                              this.onEmojiSelect(emoji)
                                          }}>
                            <Text style={{height: 37, fontSize: 30}} key={index}>{emoji}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </ScrollView>
    }
}
