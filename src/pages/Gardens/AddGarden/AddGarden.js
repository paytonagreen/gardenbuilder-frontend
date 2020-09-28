import React, { useState } from "react"
import styled from "styled-components"
import { cache, useApolloClient, useMutation, gql } from "@apollo/client"
import { FaPlusCircle } from "react-icons/fa"
import { IconContext } from "react-icons"
import { Button, Form, Input, InputSection } from "../../../components"
import { CREATE_GARDEN_MUTATION } from "../../../mutations/mutations"

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export function AddGarden() {
  const client = useApolloClient()
  const [formVisible, setFormVisible] = useState(true)
  const [gardenName, setGardenName] = useState("")
  const [createGarden, createGardenResults] = useMutation(CREATE_GARDEN_MUTATION, {
    update(cache, { data: { createGarden } }) {
      cache.modify({
        fields: {
          userGardens(existingGardens = []) {
            const newGardenRef = cache.writeFragment({
              data: createGarden,
              fragment: gql`
                fragment NewGarden on GardenType {
                  id
                  gardenName
                }
              `,
            })
            return [...existingGardens, newGardenRef]
          },
        },
      })
    },
    onError(err) {
      console.log(err)
    },
  })

  function onSubmit(event) {
    event.preventDefault()
    createGarden({
      variables: { gardenName },
    })
  }

  return (
    <div>
      <ButtonContainer onClick={() => setFormVisible(!formVisible)}>
        <IconContext.Provider value={{ size: "1.5rem" }}>
          <FaPlusCircle alt="Add Garden" aria-label="Add Garden" role="img" />
        </IconContext.Provider>
        &nbsp;Add
      </ButtonContainer>
      {formVisible && (
        <Form onSubmit={onSubmit}>
          <InputSection
            name="Garden Name"
            value={gardenName}
            setValue={setGardenName}
          />
          <Button name="submit" text="Submit" type="submit" />
        </Form>
      )}
    </div>
  )
}
