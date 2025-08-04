import { Box, Button, Heading, Text } from '@sparrowengg/twigs-react'
import React from 'react'
{/* https://picsum.photos/200 */ }

const MovieDisplayBox = (props) => {
  return (
    <Box css={{
      width: 300,
      border: '1px solid $neutral200',
      borderRadius: '$2xl',
      boxShadow: '$sm',
      backgroundColor: '$white900',
    }}>
      <Box
        css={{
          height: 140,
          backgroundColor: '#463225',
          backgroundImage: 'url("https://www.pluggedin.com/wp-content/uploads/2020/01/wake-me-up-avicii-review-image.jpg")',
          //   backgroundImage:'https://picsum.photos/200',
          borderRadius: '$2xl',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          backgroundSize: 'cover',
          position: 'relative'
        }}
      >
        <Button
          size="lg"
          css={{
            position: 'absolute',
            right: 10,
            bottom: -20,
            boxShadow: 'violet 0px 0px 20px 2px',
            padding: 10,
            borderRadius: '100%',
            width: '$10',
            zIndex: '2',
            svg: {
              display: 'block',
              marginRight: '-$2'
            }
          }}
        ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M7 6v12l10-6z"></path></svg></Button>
      </Box>

      <Box
        css={{
          padding: '$4 $8',
          position: 'relative'
        }}
      >
        <Heading size="h6" css={{
          lineHeight: 1,
          marginBottom: '4px !important',
          marginTop: '$4',
        }}> {props.name} </Heading>

        {/* <Text css={{ color: '$neutral600', marginBottom: '$8' }}> Song by Avicci </Text> */}

        <Box>
          <Text>{props.description}</Text>

          <Box
            css={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: 50,
              bottom: 0,
              borderRadius: '$2xl',
              opacity: 0.5,
              backgroundImage: 'linear-gradient(to bottom, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff);',
            }} />
        </Box>
      </Box>
    </Box>
  )
}

export default MovieDisplayBox