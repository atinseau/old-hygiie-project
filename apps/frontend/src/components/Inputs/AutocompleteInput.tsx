'use client';

import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { IoSearch } from "react-icons/io5";


import BaseInput from './BaseInput';
import TextInput, { TextInputProps } from './TextInput';
import Popover, { PopoverContent, PopoverTrigger } from '../Popover';
import isEqual from 'lodash/isEqual';

type SelectItem = {
  id?: string,
  label: string,
  value: any
}

type SelectProps = {
  placeholder?: string
  onChange?: (value?: string) => void
  items: Array<SelectItem>
  defaultValue?: string | SelectItem
  textInputProps?: TextInputProps
  classNames?: {
    content?: string
  }
}

export default function AutocompleteInput(props: SelectProps) {

  const {
    placeholder,
    onChange,
    items,
    classNames,
    defaultValue,
    textInputProps,
  } = props

  const {
    baseInputProps,
    ...inputProps
  } = textInputProps || {}

  const defaultItem = typeof defaultValue === 'string'
    ? items.find(item => item.value === defaultValue)
    : defaultValue

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState<string>(defaultItem?.label || '')
  const [selectedItem, setSelectedItem] = useState<SelectItem | undefined>(defaultItem)

  const handleChange = (item: SelectItem) => {
    setIsOpen(false)
    setSelectedItem(item)
    setSearch(item.label)
    onChange?.(item.value)
  }

  const handleSearch = (value: string) => {
    if (value !== selectedItem?.label) {
      if (selectedItem) onChange?.(undefined)
      setSelectedItem(undefined)
    }
    setSearch(value)
    setIsOpen(true)
  }

  const filteredItems = useMemo(() => {
    if (!search.length) return items
    return items.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
  }, [search])

  return <BaseInput
    {...baseInputProps}
    classNames={{ base: 'relative' }}
  >
    <Popover
      placement='bottom-start'
      offset={{
        mainAxis: 1,
        alignmentAxis: -11
      }}
      isOpen={isOpen}
      interactions={{
        click: false
      }}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>
        <TextInput
          {...inputProps}
          placeholder={placeholder}
          classNames={{
            base: [
              "z-[11] relative",
              "!transition-[border-radius,background]",
              isOpen && "!rounded-b-none"
            ]
          }}
          onChange={(e) => handleSearch(e.target.value)}
          value={search}
          endContent={<IoSearch className={"text-indigo-500 pt-[2px]"} size={20} />}
        />
      </PopoverTrigger>
      <PopoverContent className={classNames?.content}>
        {filteredItems.map((item, index) => <li
          onClick={() => handleChange(item)}
          className={clsx("cursor-pointer leading-base text-base hover:bg-indigo-300 p-2.5", {
            'bg-indigo-300': isEqual(selectedItem, item)
          })}
          key={item.id || index}
        >
          {item.label}
        </li>)}
      </PopoverContent>
    </Popover>
  </BaseInput >
}