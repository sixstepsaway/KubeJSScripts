//Thanks to Lady Lexxie#6969 for helping me get this working :)

let DropsFeathers = ['minecraft:chicken', 'eanimod:enhanced_chicken', 'chickens:chicken'] //add any feather-dropping animals here
let ShearsItem = ['minecraft:shears', 'aiotbotania:livingwood_shears', 'aiotbotania:livingrock_shears', 'botania:manasteel_shears', 'botania:elementium_shears', 'cyclic:shears_obsidian', 'cyclic:shears_flint', 'dungeons_gear:shear_dagger', 'pickletweaks: flint_shears', 'projecte:dm_shears', 'projecte:rm_shears'] //add appropriate shearing items here 
let feather = 'minecraft:feather' //in case you want a different kind of feather? 

onEvent('item.entity_interact', e => {
    if (e.hand == MAIN_HAND) {
        if (DropsFeathers.includes(`${e.target.type}`)) {
            if (e.target.tags.contains('nofeathersleft')) e.player.setStatusMessage('Try again later.')
            else {
                if (ShearsItem.includes(`${e.item.id}`)) {
                    e.player.setStatusMessage('You snipped some feathers!')
                    e.player.give(`${Math.floor(Math.random() * 5) + 1}x ${feather}`)
                    e.target.tags.add('nofeathersleft')
                    e.player.damageHeldItem(MAIN_HAND, 10)
                    e.server.schedule(10 * MINUTE, () => {
                        e.target.tags.remove('nofeathersleft')
                            //e.player.setStatusMessage('The animal is ready now.')
                    })
                } else {
                    e.player.setStatusMessage('They had a loose feather!')
                    e.player.give('minecraft:feather')
                    e.target.tags.add('nofeathersleft')
                    e.server.schedule(10 * MINUTE, () => {
                        e.target.tags.remove('nofeathersleft')
                            //e.player.setStatusMessage('The animal is ready now.')
                    })
                }
            }
        }
    }
})
