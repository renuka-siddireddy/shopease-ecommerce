package com.example.ecommerce.controller;

import com.example.ecommerce.model.*;
import com.example.ecommerce.repository.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository,
                           CartItemRepository cartItemRepository,
                           CartRepository cartRepository,
                           UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/place/{userId}")
    public String placeOrder(@PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> items = cartItemRepository.findAll()
                .stream()
                .filter(i -> i.getCart().getId().equals(cart.getId()))
                .toList();

        for (CartItem item : items) {
            Order order = new Order();
            order.setUser(user);
            order.setProduct(item.getProduct());
            order.setQuantity(item.getQuantity());
            order.setOrderDate(LocalDate.now());
            order.setDeliveryDate(LocalDate.now().plusDays(5));

            orderRepository.save(order);
        }

        // clear cart after order
        cartItemRepository.deleteAll(items);

        return "Order placed";
    }

    @GetMapping("/{userId}")
    public List<Order> getOrders(@PathVariable Long userId) {
        return orderRepository.findByUser_Id(userId);

    }
    @PutMapping("/cancel/{orderId}")
    public String cancelOrder(@PathVariable Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("DELIVERED".equals(order.getStatus())) {
            return "Delivered orders cannot be cancelled";
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);

        return "Order cancelled";
    }

}
